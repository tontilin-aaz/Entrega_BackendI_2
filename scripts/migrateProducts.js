// scripts/migrateProducts.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

// Importar el modelo
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: { type: String, unique: true },
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: [String]
});

const ProductModel = mongoose.model('Product', productSchema);

const migrate = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        // Leer el archivo products.json
        const productsPath = join(__dirname, '../src/data/products.json');
        const productsData = fs.readFileSync(productsPath, 'utf8');
        const products = JSON.parse(productsData);

        console.log(`📦 Productos encontrados en JSON: ${products.length}`);

        // Limpiar productos existentes
        await ProductModel.deleteMany({});
        console.log('🗑️ Productos antiguos eliminados');

        // Insertar productos
        for (const product of products) {
            const newProduct = await ProductModel.create({
                title: product.title,
                description: product.description,
                code: product.code,
                price: product.price,
                status: product.status !== undefined ? product.status : true,
                stock: product.stock,
                category: product.category,
                thumbnails: product.thumbnails || []
            });
            console.log(`✅ Producto creado: ${product.title} (${product.code})`);
        }

        // Verificar
        const count = await ProductModel.countDocuments();
        console.log(`\n📊 Total productos en MongoDB: ${count}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

migrate();