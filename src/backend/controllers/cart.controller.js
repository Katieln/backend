// controllers/cartController.js
const cartService = require('../services/cartService');

class CartController {
    async addToCart(req, res) {
        try {
            if (!req.isAuthenticated()) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            const { productId } = req.body;
            const userId = req.user._id;

            const cart = await cartService.addToCart(userId, productId);

            res.json({ message: 'Producto agregado correctamente al carrito', cart });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async removeFromCart(req, res) {
        try {
            if (!req.isAuthenticated()) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            const { productId } = req.body;
            const userId = req.user._id;

            const cart = await cartService.removeFromCart(userId, productId);

            res.json({ message: 'Producto eliminado correctamente del carrito', cart });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async getCartByUser (req, res) {
        try {
            const userId = req.cookies.userId;
            const cartData = await cartService.getCartByUserId(userId);
            res.json(cartData);
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Error al obtener productos del carrito' });
        }
    };

}

    
    





module.exports = new CartController();
