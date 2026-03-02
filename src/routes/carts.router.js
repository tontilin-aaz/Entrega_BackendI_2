// src/routes/carts.router.js
import { Router } from "express";
import CartManager from "../manager/CartManager.mongo.js";

const router = Router();
const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ status: "success", data: newCart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    res.json({ status: "success", data: cart });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const updatedCart = await cartManager.addProductToCart(cartId, productId);
    res.json({ status: "success", data: updatedCart });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const updatedCart = await cartManager.removeProductFromCart(cartId, productId);
    res.json({ status: "success", data: updatedCart });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const { products } = req.body;
    
    if (!Array.isArray(products)) {
      return res.status(400).json({ 
        status: "error", 
        message: "El cuerpo debe contener un array de productos" 
      });
    }
    
    const updatedCart = await cartManager.updateCart(cartId, products);
    res.json({ status: "success", data: updatedCart });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const { quantity } = req.body;
    
    if (!quantity) {
      return res.status(400).json({ 
        status: "error", 
        message: "Debe proporcionar una cantidad" 
      });
    }
    
    const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);
    res.json({ status: "success", data: updatedCart });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const updatedCart = await cartManager.clearCart(cartId);
    res.json({ 
      status: "success", 
      data: updatedCart, 
      message: "Carrito vaciado correctamente" 
    });
  } catch (error) {
    res.status(404).json({ status: "error", message: error.message });
  }
});

export default router;