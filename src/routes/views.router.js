import { Router } from "express";
import ProductManager from "../manager/ProductManager.mongo.js";
import CartManager from "../manager/CartManager.mongo.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Ruta home (todos los productos sin paginación)
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getAllProducts(); // usa el nuevo método
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

// Ruta tiempo real
router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getAllProducts();
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

// Ruta productos con paginación (única)
router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    
    const result = await productManager.getProducts({
      limit,
      page,
      sort,
      query
    });
    
    console.log("Productos obtenidos en /products:", result.payload.length);

    res.render("products", { 
      title: "Productos con Paginación",
      products: result.payload,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      limit,
      sort,
      query: query || ''
    });
  } catch (error) {
    console.error("Error en vista products:", error);
    res.status(500).render("error", { 
      title: "Error",
      error: error.message 
    });
  }
});

// Ruta detalle de producto
router.get("/products/:pid", async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    res.render("productDetail", { 
      title: product.title,
      product 
    });
  } catch (error) {
    res.status(500).render("error", { 
      title: "Error",
      error: error.message 
    });
  }
});

// Ruta carrito
router.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    res.render("cart", { 
      title: "Carrito de Compras",
      cart 
    });
  } catch (error) {
    res.status(500).render("error", { 
      title: "Error",
      error: error.message 
    });
  }
});
router.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    res.render("cart", { title: "Carrito de Compras", cart });
  } catch (error) {
    res.status(404).render("error", { 
      title: "Error",
      error: `Carrito no encontrado: ${error.message}` 
    });
  }
});
export default router;