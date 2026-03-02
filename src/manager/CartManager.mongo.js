import mongoose from 'mongoose';
import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

class CartManager {
  async createCart() {
    try {
      const newCart = await CartModel.create({ products: [] });
      return this._transformCart(newCart.toObject());
    } catch (error) {
      throw error;
    }
  }

  async getCartById(cid) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        throw new Error(`ID de carrito inválido: ${cid}`);
      }
      
      const cart = await CartModel.findById(cid)
        .populate('products.product')
        .lean();
      
      if (!cart) {
        throw new Error(`Carrito con ID ${cid} no encontrado`);
      }
      
      // Filtrar productos que ya no existen en la base de datos
      const validProducts = cart.products.filter(item => item.product !== null);
      
      // Si hay productos eliminados, actualizar el carrito
      if (validProducts.length !== cart.products.length) {
        console.log(`🧹 Limpiando ${cart.products.length - validProducts.length} productos huérfanos del carrito ${cid}`);
        await CartModel.findByIdAndUpdate(cid, { products: validProducts });
        cart.products = validProducts;
      }
      
      return this._transformCart(cart);
    } catch (error) {
      throw error;
    }
  }

  async addProductToCart(cid, pid) {
    try {
      // Validar IDs
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        throw new Error(`ID de carrito inválido: ${cid}`);
      }
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        throw new Error(`ID de producto inválido: ${pid}`);
      }

      const productExists = await ProductModel.findById(pid);
      if (!productExists) {
        throw new Error(`Producto con ID ${pid} no encontrado`);
      }

      const cart = await CartModel.findById(cid);
      if (!cart) {
        throw new Error(`Carrito con ID ${cid} no encontrado`);
      }

      // Limpiar productos nulos antes de agregar
      cart.products = cart.products.filter(item => item.product !== null);

      const productIndex = cart.products.findIndex(
        item => item.product && item.product.toString() === pid
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await cart.save();

      const updatedCart = await CartModel.findById(cid)
        .populate('products.product')
        .lean();
      
      return this._transformCart(updatedCart);
    } catch (error) {
      throw error;
    }
  }

  async removeProductFromCart(cid, pid) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        throw new Error(`ID de carrito inválido: ${cid}`);
      }
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        throw new Error(`ID de producto inválido: ${pid}`);
      }

      const cart = await CartModel.findById(cid);
      if (!cart) {
        throw new Error(`Carrito con ID ${cid} no encontrado`);
      }

      cart.products = cart.products.filter(
        item => item.product && item.product.toString() !== pid
      );
      await cart.save();

      const updatedCart = await CartModel.findById(cid)
        .populate('products.product')
        .lean();
      
      return this._transformCart(updatedCart);
    } catch (error) {
      throw error;
    }
  }

  async updateCart(cid, products) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        throw new Error(`ID de carrito inválido: ${cid}`);
      }

      // Validar que todos los productos existen
      const validProducts = [];
      for (const item of products) {
        if (!mongoose.Types.ObjectId.isValid(item.product)) {
          throw new Error(`ID de producto inválido: ${item.product}`);
        }
        const productExists = await ProductModel.findById(item.product);
        if (productExists) {
          validProducts.push(item);
        } else {
          console.log(`⚠️ Producto ${item.product} no encontrado, omitido del carrito`);
        }
      }

      const cart = await CartModel.findByIdAndUpdate(
        cid,
        { products: validProducts },
        { new: true, runValidators: true }
      ).populate('products.product').lean();

      if (!cart) {
        throw new Error(`Carrito con ID ${cid} no encontrado`);
      }
      
      return this._transformCart(cart);
    } catch (error) {
      throw error;
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
    try {
      if (!quantity || quantity < 1) {
        throw new Error('La cantidad debe ser mayor a 0');
      }
      
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        throw new Error(`ID de carrito inválido: ${cid}`);
      }
      if (!mongoose.Types.ObjectId.isValid(pid)) {
        throw new Error(`ID de producto inválido: ${pid}`);
      }

      const cart = await CartModel.findById(cid);
      if (!cart) {
        throw new Error(`Carrito con ID ${cid} no encontrado`);
      }

      // Limpiar productos nulos
      cart.products = cart.products.filter(item => item.product !== null);

      const productItem = cart.products.find(
        item => item.product && item.product.toString() === pid
      );
      
      if (!productItem) {
        throw new Error(`Producto con ID ${pid} no encontrado en el carrito`);
      }

      productItem.quantity = quantity;
      await cart.save();

      const updatedCart = await CartModel.findById(cid)
        .populate('products.product')
        .lean();
      
      return this._transformCart(updatedCart);
    } catch (error) {
      throw error;
    }
  }

  async clearCart(cid) {
    try {
      if (!mongoose.Types.ObjectId.isValid(cid)) {
        throw new Error(`ID de carrito inválido: ${cid}`);
      }

      const cart = await CartModel.findByIdAndUpdate(
        cid,
        { products: [] },
        { new: true }
      ).populate('products.product').lean();

      if (!cart) {
        throw new Error(`Carrito con ID ${cid} no encontrado`);
      }
      
      return this._transformCart(cart);
    } catch (error) {
      throw error;
    }
  }

  // Transforma un carrito (con productos populados) para agregar 'id' a cada producto
  _transformCart(cart) {
    if (!cart) return cart;
    
    // Filtrar productos nulos y transformar
    const validProducts = cart.products.filter(item => item.product !== null);
    
    return {
      id: cart._id.toString(),
      products: validProducts.map(item => ({
        quantity: item.quantity,
        product: {
          id: item.product._id.toString(),
          title: item.product.title || 'Producto no disponible',
          description: item.product.description || '',
          price: item.product.price || 0,
          stock: item.product.stock || 0,
          category: item.product.category || 'Sin categoría',
          status: item.product.status || false,
          code: item.product.code || '',
          thumbnails: item.product.thumbnails || []
        }
      })),
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    };
  }
}

export default CartManager;