import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import exphbs from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./manager/ProductManager.mongo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configuración de Handlebars con helpers
const hbs = exphbs.create({
    helpers: {
        multiply: (a, b) => a * b,
        cartTotal: (products) => {
            if (!products || !Array.isArray(products)) return 0;
            return products.reduce((total, item) => total + (item.product?.price || 0) * (item.quantity || 0), 0);
        },
        json: (context) => JSON.stringify(context, null, 2)
    }
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Guardamos io en app
app.set('io', io);

// Rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// WebSockets
const productManager = new ProductManager();

io.on("connection", async (socket) => {
    console.log("🟢 Nuevo cliente conectado:", socket.id);
    
    try {
        // Enviar lista actual de productos al conectarse
        const products = await productManager.getAllProducts();
        socket.emit("productsUpdated", products);
    } catch (error) {
        console.error("Error al enviar productos por socket:", error);
    }

    // Escuchar evento para agregar producto
    socket.on("addProduct", async (productData) => {
        try {
            console.log("📦 Recibida solicitud para agregar producto:", productData);
            
            const newProduct = await productManager.addProduct(productData);
            console.log("✅ Producto agregado:", newProduct);
            
            // Obtener todos los productos actualizados
            const updatedProducts = await productManager.getAllProducts();
            
            // Emitir a TODOS los clientes conectados
            io.emit("productsUpdated", updatedProducts);
            io.emit("productAdded", newProduct);
            
        } catch (error) {
            console.error("❌ Error al agregar producto:", error);
            socket.emit("error", { message: error.message });
        }
    });

    // Escuchar evento para eliminar producto
    socket.on("deleteProduct", async (productId) => {
        try {
            console.log("🗑️ Recibida solicitud para eliminar producto:", productId);
            
            await productManager.deleteProduct(productId);
            console.log("✅ Producto eliminado:", productId);
            
            // Obtener todos los productos actualizados
            const updatedProducts = await productManager.getAllProducts();
            
            // Emitir a TODOS los clientes conectados
            io.emit("productsUpdated", updatedProducts);
            io.emit("productDeleted", productId);
            
        } catch (error) {
            console.error("❌ Error al eliminar producto:", error);
            socket.emit("error", { message: error.message });
        }
    });

    socket.on("disconnect", () => {
        console.log("🔴 Cliente desconectado:", socket.id);
    });
});

// Conexión a MongoDB y arranque del servidor
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        httpServer.listen(PORT, () => {
            console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
};

connectDB();

export default app;