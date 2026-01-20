import { Router } from "express";
import ProductManager from "../manager/Product.manager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

// GET /api/products/
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json({ status: "success", data: products });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    res.json({ status: "success", data: product });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

// POST /api/products/
router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json({ status: "success", data: newProduct });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProduct = await productManager.updateProduct(productId, req.body);
    res.json({ status: "success", data: updatedProduct });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const deletedProduct = await productManager.deleteProduct(productId);
    res.json({ status: "success", data: deletedProduct, message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

export default router;