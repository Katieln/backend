const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
        enum: ['1', '2', '3', '4', '5']
    },
    stock: {
        type: Number,
        required: true
    },
})

productSchema.methods.setImgUrl = function setImgUrl(){
}

const Products = mongoose.model('Product', productSchema);

module.exports = Products;