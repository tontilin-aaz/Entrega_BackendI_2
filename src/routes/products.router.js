// src/routes/products.router.js
import { Router } from "express";
import ProductManager from "../manager/ProductManager.mongo.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query;
    
    const result = await productManager.getProducts({
      limit,
      page,
      sort,
      query
    });
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      status: "error", 
      message: error.message 
    });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    res.json({ status: "success", data: product });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    
    const io = req.app.get('io');
    const { payload: updatedProducts } = await productManager.getProducts();
    io.emit("productsUpdated", updatedProducts);
    io.emit("productAdded", newProduct);
    
    res.status(201).json({ status: "success", data: newProduct });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProduct = await productManager.updateProduct(productId, req.body);
    
    const io = req.app.get('io');
    const { payload: updatedProducts } = await productManager.getProducts();
    io.emit("productsUpdated", updatedProducts);
    
    res.json({ status: "success", data: updatedProduct });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const deletedProduct = await productManager.deleteProduct(productId);
    
    const io = req.app.get('io');
    const { payload: updatedProducts } = await productManager.getProducts();
    io.emit("productsUpdated", updatedProducts);
    io.emit("productDeleted", productId);
    
    res.json({ 
      status: "success", 
      data: deletedProduct, 
      message: "Producto eliminado correctamente" 
    });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

router.get("/debug/count", async (req, res) => {
  try {
    // Importamos el modelo directamente para contar
    const { default: ProductModel } = await import("../models/product.model.js");
    const count = await ProductModel.countDocuments();
    const products = await ProductModel.find().lean();
    
    res.json({ 
      message: "Productos en MongoDB", 
      count,
      products: products.map(p => ({ id: p._id, title: p.title, code: p.code }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;