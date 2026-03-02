import ProductModel from "../models/product.model.js";

class ProductManager {
  // Agrega un producto y lo devuelve con el campo 'id'
  async addProduct(product) {
    try {
      const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
      for (const field of requiredFields) {
        if (!product[field]) {
          throw new Error(`El campo ${field} es obligatorio`);
        }
      }

      const existingProduct = await ProductModel.findOne({ code: product.code });
      if (existingProduct) {
        throw new Error(`Ya existe un producto con el código ${product.code}`);
      }

      const newProduct = await ProductModel.create({
        title: product.title,
        description: product.description,
        code: product.code,
        price: Number(product.price),
        status: product.status !== undefined ? product.status : true,
        stock: Number(product.stock),
        category: product.category,
        thumbnails: product.thumbnails || []
      });

      // Convertir a objeto plano y agregar campo id
      const plainProduct = newProduct.toObject();
      plainProduct.id = plainProduct._id.toString();
      return plainProduct;
    } catch (error) {
      throw error;
    }
  }

  // Obtiene todos los productos sin paginación (para vistas home, realtime, etc.)
  async getAllProducts() {
    try {
      const products = await ProductModel.find().lean();
      return products.map(p => ({ ...p, id: p._id.toString() }));
    } catch (error) {
      throw error;
    }
  }

  // Obtiene productos con paginación, filtros y ordenamiento (para API y vistas con paginación)
  async getProducts(queryParams = {}) {
    try {
      const { limit = 10, page = 1, sort, query } = queryParams;

      let filter = {};
      if (query) {
        if (query === 'disponibles') filter.status = true;
        else if (query === 'no-disponibles') filter.status = false;
        else filter.category = query;
      }

      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        lean: true,
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {}
      };

      const products = await ProductModel.paginate(filter, options);

      // Agregar campo id a cada documento
      const docsWithId = products.docs.map(doc => ({
        ...doc,
        id: doc._id.toString()
      }));

      const baseUrl = '/api/products';
      const queryString = [];
      if (limit) queryString.push(`limit=${limit}`);
      if (sort) queryString.push(`sort=${sort}`);
      if (query) queryString.push(`query=${query}`);
      const queryStr = queryString.length > 0 ? `&${queryString.join('&')}` : '';

      return {
        status: 'success',
        payload: docsWithId,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevLink: products.hasPrevPage ? `${baseUrl}?page=${products.prevPage}${queryStr}` : null,
        nextLink: products.hasNextPage ? `${baseUrl}?page=${products.nextPage}${queryStr}` : null
      };
    } catch (error) {
      throw error;
    }
  }

  // Obtiene un producto por ID con campo id
  async getProductById(pid) {
    try {
      const product = await ProductModel.findById(pid).lean();
      if (!product) {
        throw new Error(`Producto con ID ${pid} no encontrado`);
      }
      return { ...product, id: product._id.toString() };
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(pid, updatedFields) {
    try {
      if (updatedFields.id) delete updatedFields.id;
      if (updatedFields.price) updatedFields.price = Number(updatedFields.price);
      if (updatedFields.stock) updatedFields.stock = Number(updatedFields.stock);

      const product = await ProductModel.findByIdAndUpdate(
        pid,
        updatedFields,
        { new: true, runValidators: true }
      ).lean();

      if (!product) {
        throw new Error(`Producto con ID ${pid} no encontrado`);
      }
      return { ...product, id: product._id.toString() };
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(pid) {
    try {
      const product = await ProductModel.findByIdAndDelete(pid).lean();
      if (!product) {
        throw new Error(`Producto con ID ${pid} no encontrado`);
      }
      return { ...product, id: product._id.toString() };
    } catch (error) {
      throw error;
    }
  }
}

export default ProductManager;