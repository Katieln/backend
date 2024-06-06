const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    method: {
        type: String,
        enum: ['local', 'github'],
        required: true,
      },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            title: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
