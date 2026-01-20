import fs from "fs";

const fsPromise = fs.promises;

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async readFile() {
    try {
      const data = await fsPromise.readFile(this.path, "utf8");
      return JSON.parse(data);
    } catch (error) {
      // Si el archivo no existe, retorna un array vacío
      return [];
    }
  }

  async writeFile(data) {
    await fsPromise.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this.readFile();
    
    // Generar ID único
    const newId = carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1;
    
    const newCart = {
      id: newId,
      products: []
    };
    
    carts.push(newCart);
    await this.writeFile(carts);
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this.readFile();
    const cart = carts.find(c => c.id === Number(cid));
    
    if (!cart) {
      throw new Error(`Carrito con ID ${cid} no encontrado`);
    }
    
    return cart;
  }

  async addProductToCart(cid, pid) {
    const carts = await this.readFile();
    const cartIndex = carts.findIndex(c => c.id === Number(cid));
    
    if (cartIndex === -1) {
      throw new Error(`Carrito con ID ${cid} no encontrado`);
    }
    
    const cart = carts[cartIndex];
    const productId = Number(pid);
    
    // Verificar si el producto ya existe en el carrito
    const existingProductIndex = cart.products.findIndex(p => p.product === productId);
    
    if (existingProductIndex !== -1) {
      // Incrementar cantidad si el producto ya existe
      cart.products[existingProductIndex].quantity += 1;
    } else {
      // Agregar nuevo producto con cantidad 1
      cart.products.push({
        product: productId,
        quantity: 1
      });
    }
    
    await this.writeFile(carts);
    return cart;
  }
}

export default CartManager;