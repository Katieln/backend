const express = require('express');
const passport = require('passport');
const router = express.Router(); // Aquí se crea el router correctamente
const Product = require('../models/product.model')


// Ruta para actualizar el stock de varios productos
router.put('/', async (req, res) => {
    const updates = req.body.updates;

    try {
        const updatePromises = updates.map(async update => {
            const { productId, newStock } = update;
            const product = await Product.findByIdAndUpdate(
                productId,
                { stock: newStock },
                { new: true } // Devuelve el documento actualizado
            );

            if (!product) {
                return Promise.reject(new Error(`Producto no encontrado: ${productId}`));
            }

            return product;
        });

        const updatedProducts = await Promise.all(updatePromises);

        res.status(200).json({
            msg: 'Stock de los productos actualizado correctamente',
            data: updatedProducts
        });
    } catch (err) {
        console.error('Error al actualizar el stock de los productos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
