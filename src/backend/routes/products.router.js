// products.router.js
const express = require('express');
const {Router} = express
const router = new Router()
const upload = require('../config/multerConfig');
const sharp = require('sharp');
const Product = require('../models/product.model');
const path = require('path');
const User = require('../models/user.model');
const {createHash, isValidPassword} = require('../utils/bcrypt')
const productController = require('../controllers/product.controller');

// Crear producto
router.post('/newPr', productController.addProduct);


// Agregar imagen del producto
router.put('/upload', upload.single('image'), productController.uploadImage);


// Obtener todos los productos con filtros
router.get('/allPr', productController.getAllProducts);




// Obtener producto por ID
router.get('/prById/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.status(200).json({
            msg: 'Producto encontrado',
            data: product
        });
    } catch (err) {
        res.status(500).send({
            error: err
        })}
});


// Eliminar producto por ID
router.delete('/prById/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.status(200).json({
            msg: 'Producto eliminado correctamente',
            data: product
        });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Actualizar producto por ID
router.put('/prById/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedData = req.body; 

        const product = await Product.findByIdAndUpdate(productId, updatedData, { new: true });

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({
            msg: 'Producto actualizado correctamente',
            data: product
        });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});




module.exports = router;
