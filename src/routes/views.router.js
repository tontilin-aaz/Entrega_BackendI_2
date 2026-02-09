import { Router } from "express";
import ProductManager from "../manager/Product.manager.js";

const router = Router();
const productManager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { 
      title: "Productos",
      products 
    });
  } catch (error) {
    res.status(500).render("error", { 
      title: "Error",
      error: error.message 
    });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { 
      title: "Productos en Tiempo Real",
      products 
    });
  } catch (error) {
    res.status(500).render("error", { 
      title: "Error",
      error: error.message 
    });
  }
});

export default router;