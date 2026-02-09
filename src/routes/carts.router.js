import { Router } from "express";
import CartManager from "../manager/Cart.manager.js";

const router = Router();
const cartManager = new CartManager("./src/data/carts.json");

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

export default router;