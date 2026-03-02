// src/models/cart.model.js
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Hacemos referencia al modelo 'Product'
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: [1, 'La cantidad mínima es 1'],
                default: 1
            }
        }
    ]
}, {
    timestamps: true
});

// Middleware para transformar el ID
cartSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
});

const CartModel = mongoose.model('Cart', cartSchema);

export default CartModel;