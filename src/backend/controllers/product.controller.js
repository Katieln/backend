// src/controllers/productController.js
const productService = require('../services/productService');

const addProduct = async (req, res) => {
    try {
        await productService.addProduct(req.body);
        res.status(201).send({
            msg: 'Producto agregado correctamente',
            data: req.body
        });
    } catch (err) {
        res.status(500).send({
            error: err.message
        });
    }
};

const uploadImage = async (req, res) => {
    try {
        await productService.uploadImage(req.body.productId, req.file);
        res.send('Imagen subida y producto actualizado correctamente.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al subir la imagen.');
    }
};

const getAllProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, sortBy } = req.query;
        const allProducts = await productService.getAllProducts(category, minPrice, maxPrice, sortBy);
        res.json(allProducts);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
};

module.exports = {
    addProduct,
    uploadImage, getAllProducts
};
