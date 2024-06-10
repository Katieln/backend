const express = require('express');
const passport = require('passport');
const router = express.Router(); // Aquí se crea el router correctamente
const Product = require('../models/product.model')


// Ruta para actualizar el stock de varios productos
router.put('/', async (req, res) => {
    const updates = req.body.updates;

    try {
        const updatePromises = updates.map(async update => {
            const { userId, newStock } = update;
            const user = await user.findByIdAndUpdate(
                userId,
                { address: newAdress },
                { new: true } // Devuelve el documento actualizado
            );

            if (!user) {
                return Promise.reject(new Error(`usero no encontrado: ${userId}`));
            }

            return user;
        });

        const updatedusers = await Promise.all(updatePromises);

        res.status(200).json({
            msg: 'Stock de los useros actualizado correctamente',
            data: updateduser
        });
    } catch (err) {
        console.error('Error al actualizar el stock de los productos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
