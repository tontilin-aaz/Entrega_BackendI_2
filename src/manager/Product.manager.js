import fs from "fs";

const fsPromise = fs.promises;

class ProductManager {
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

  async addProduct(product) {
    const products = await this.readFile();
    
    // Validar campos obligatorios
    const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
    for (const field of requiredFields) {
      if (!product[field]) {
        throw new Error(`El campo ${field} es obligatorio`);
      }
    }
    
    // Validar que el código no se repita
    const existingProduct = products.find(p => p.code === product.code);
    if (existingProduct) {
      throw new Error(`Ya existe un producto con el código ${product.code}`);
    }
    
    // Generar ID único
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    const newProduct = {
      id: newId,
      title: product.title,
      description: product.description,
      code: product.code,
      price: Number(product.price),
      status: product.status !== undefined ? product.status : true,
      stock: Number(product.stock),
      category: product.category,
      thumbnails: product.thumbnails || []
    };
    
    products.push(newProduct);
    await this.writeFile(products);
    return newProduct;
  }

  async getProducts() {
    return await this.readFile();
  }

  async getProductById(pid) {
    const products = await this.readFile();
    const product = products.find(p => p.id === Number(pid));
    if (!product) {
      throw new Error(`Producto con ID ${pid} no encontrado`);
    }
    return product;
  }

  async updateProduct(pid, updatedFields) {
    const products = await this.readFile();
    const index = products.findIndex(p => p.id === Number(pid));
    
    if (index === -1) {
      throw new Error(`Producto con ID ${pid} no encontrado`);
    }
    
    // No permitir actualizar el ID
    if (updatedFields.id) {
      delete updatedFields.id;
    }
    
    // Actualizar solo los campos permitidos
    const productToUpdate = products[index];
    const allowedFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails'];
    
    allowedFields.forEach(field => {
      if (updatedFields[field] !== undefined) {
        if (field === 'price' || field === 'stock') {
          productToUpdate[field] = Number(updatedFields[field]);
        } else {
          productToUpdate[field] = updatedFields[field];
        }
      }
    });
    
    await this.writeFile(products);
    return productToUpdate;
  }

  async deleteProduct(pid) {
    const products = await this.readFile();
    const index = products.findIndex(p => p.id === Number(pid));
    
    if (index === -1) {
      throw new Error(`Producto con ID ${pid} no encontrado`);
    }
    
    const deletedProduct = products.splice(index, 1)[0];
    await this.writeFile(products);
    return deletedProduct;
  }
}

export default ProductManager;