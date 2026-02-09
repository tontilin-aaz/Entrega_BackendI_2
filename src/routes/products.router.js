import { Router } from "express";
import ProductManager from "../manager/Product.manager.js";
import { io } from "../app.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json({ status: "success", data: products });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
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
    
    // Emitir evento WebSocket para actualizar clientes
    const updatedProducts = await productManager.getProducts();
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
    
    // Emitir evento WebSocket para actualizar clientes
    const updatedProducts = await productManager.getProducts();
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
    
    // Emitir evento WebSocket para actualizar clientes
    const updatedProducts = await productManager.getProducts();
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

export default router;