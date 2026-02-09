import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import exphbs from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./manager/Product.manager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const productManager = new ProductManager("./src/data/products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado:", socket.id);

    const products = await productManager.getProducts();
    socket.emit("productsUpdated", products);

    socket.on("addProduct", async (productData) => {
        try {
            const newProduct = await productManager.addProduct(productData);
            const updatedProducts = await productManager.getProducts();
            io.emit("productsUpdated", updatedProducts);
            socket.emit("productAdded", newProduct);
        } catch (error) {
            socket.emit("error", error.message);
        }
    });

    socket.on("deleteProduct", async (productId) => {
        try {
            await productManager.deleteProduct(productId);
            const updatedProducts = await productManager.getProducts();
            io.emit("productsUpdated", updatedProducts);
            socket.emit("productDeleted", productId);
        } catch (error) {
            socket.emit("error", error.message);
        }
    });

    socket.on("disconnect", () => {
        console.log("Cliente desconectado:", socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});

export { io };