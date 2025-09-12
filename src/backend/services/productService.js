// src/services/productService.js
const Product = require('../models/product.model');

const addProduct = async (productData) => {
    await Product.create(productData);
};

const findUserById = async (userId) => {
    return await User.findById(userId);
};

const uploadImage = async (productId, file) => {
    if (!file) {
        throw new Error('No se ha subido ningún archivo.');
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new Error('Producto no encontrado.');
    }

    const filePath = `/images/${file.filename}`;
    product.image = filePath;
    await product.save();
};

const getAllProducts = async (category, minPrice, maxPrice, sortBy) => {
    const filters = {};

    if (category) {
        filters.category = category;
    }

    if (minPrice) {
        filters.price = { ...filters.price, $gte: minPrice };
    }

    if (maxPrice) {
        filters.price = { ...filters.price, $lte: maxPrice };
    }

    let sortCriteria = {};
    if (sortBy === 'priceAsc') {
        sortCriteria = { price: 1 }; // Ordenar de menor a mayor
    } else if (sortBy === 'priceDesc') {
        sortCriteria = { price: -1 }; // Ordenar de mayor a menor
    }

    return await Product.find(filters).sort(sortCriteria);
};

module.exports = {
    addProduct,
    uploadImage, getAllProducts, findUserById
};
