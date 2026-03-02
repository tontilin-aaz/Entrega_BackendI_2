// src/models/product.model.js
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        index: true
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    code: {
        type: String,
        required: [true, 'El código es obligatorio'],
        unique: true
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio'],
        min: [0, 'El stock no puede ser negativo']
    },
    category: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        index: true
    },
    thumbnails: [String]
}, {
    timestamps: true
});

// Agregar plugin de paginación
productSchema.plugin(mongoosePaginate);

productSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
});

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;