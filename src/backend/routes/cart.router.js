const express = require('express');
const {Router} = express
const router = new Router()
const User = require('../models/user.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const { createHash, isValidPassword } = require('../utils/bcrypt');
const passport = require('passport')
const initializeAuth = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cart.controller');



const { isAuthenticated, authorize } = initializeAuth();

router.post('/add-to-cart', (req, res) => cartController.addToCart(req, res));

router.post('/remove-from-cart', (req, res) => cartController.removeFromCart(req, res));
  


// Obtener los productos del carrito para un usuario 

router.get('/ByUser', isAuthenticated, cartController.getCartByUser);

// router.get('/ByUser', isAuthenticated, async (req, res) => {
//     try {
//         const userId = req.cookies.userId;

//         const cart = await Cart.findOne({ userId: userId }).populate('items.product');

//         if (!cart) {
//             return res.status(404).json({ msg: 'Carrito no encontrado' });
//         }

//         const productsInCart = cart.items.map(item => ({
//             product: item.product ? item.product.title : "Producto no encontrado",
//             quantity: item.quantity,
//             image: item.image,
//             price: item.price,
//             totalPrice: item.price * item.quantity
//         }));

//         const cartTotal = cart.total;

//         res.json({ products: productsInCart, total: cartTotal });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ msg: 'Error al obtener productos del carrito' });
//     }
// });




router.get('/:cid', isAuthenticated, async (req, res) => {
    try {
        const cartId = req.params.cid;

        const cart = await Cart.findOne({ _id: cartId }).populate('items.product');

        if (!cart) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }

        const productsInCart = cart.items.map(item => ({
            product: item.product ? item.product.title : "Producto no encontrado",
            quantity: item.quantity
        }));

        res.json(productsInCart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al obtener productos del carrito' });
    }
});
/*************************************************************/

// Agregar producto al carrito
router.post('/pr', async (req, res) => {
    try {
        const { productId, userId } = req.body;
        const requestedQuantity = req.body.quantity || 1; 

       
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ error: 'ID de usuario inválido' });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send({ error: 'El producto no existe' });
        }

        if (product.stock < requestedQuantity) {
            return res.status(400).send({ error: 'Stock insuficiente para el producto' });
        }

        let cart = await Cart.findOne({ userId: userId });

        if (!cart) {
            cart = new Cart({ userId: userId, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(item => item.product.equals(productId));

        if (existingItemIndex !== -1) {
            const newQuantity = cart.items[existingItemIndex].quantity + requestedQuantity;
            if (product.stock < newQuantity) {
                return res.status(400).send({ error: 'Stock insuficiente para la cantidad solicitada' });
            }
            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            cart.items.push({ product: productId, quantity: requestedQuantity });
        }

        await cart.save();

        res.status(201).send({ msg: 'Producto agregado correctamente al carrito' });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});



/*************************************************************/



// Eliminar todos los productos del carrito de un usuario 
router.delete('/:userId', async (req, res) => {
    try {
        
        const userId = req.params.userId;

        
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }

       
        cart.items = [];

        await cart.save();

        res.status(200).json({ msg: 'Carrito vaciado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al vaciar el carrito' });
    }
});



/*************************************************************/



// Eliminar un producto del carrito de un usuario
router.delete('/:userId/product/:productId', async (req, res) => {
    try {
       
        const userId = req.params.userId;
        const productId = req.params.productId;


        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }


        cart.items = cart.items.filter(item => !item.product.equals(productId));


        await cart.save();


        await cart.populate('items.product');

        const productsInCart = cart.items.map(item => ({
            product: item.product ? item.product.title : "Producto no encontrado",
            quantity: item.quantity
        }));

        res.status(200).json({
            msg: 'Producto eliminado correctamente del carrito',
            data: productsInCart
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al eliminar el producto del carrito' });
    }
});




/*************************************************************/



// Actualizar un producto en el carrito
router.put('/:userId/product/:productId', async (req, res) => {
    try {
       
        const userId = req.params.userId;
        const productId = req.params.productId;
        const { quantity } = req.body;

       
        if (quantity <= 0) {
            return res.status(400).json({ msg: 'La cantidad debe ser mayor que cero' });
        }

       
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }

       
        const itemIndex = cart.items.findIndex(item => item.product.equals(productId));

        if (itemIndex === -1) {
            return res.status(404).json({ msg: 'Producto no encontrado en el carrito' });
        }


        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ msg: 'Stock insuficiente para la cantidad solicitada' });
        }


        cart.items[itemIndex].quantity = quantity;

   
        await cart.save();


        await cart.populate('items.product');


        const productsInCart = cart.items.map(item => ({
            product: item.product ? item.product.title : "Producto no encontrado",
            quantity: item.quantity
        }));

        res.status(200).json({
            msg: 'Cantidad de producto actualizada correctamente en el carrito',
            data: productsInCart
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al actualizar la cantidad de producto en el carrito' });
    }
});




/*************************************************************/



router.put('/:cid', async (req, res) => {
    try {
   
        const cartId = req.params.cid;
        const { products } = req.body;


        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ msg: 'Se requiere un arreglo de productos' });
        }


        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }

 
        const newItems = [];

        for (const item of products) {
            const { productId, quantity } = item;


            if (quantity <= 0) {
                return res.status(400).json({ msg: 'La cantidad debe ser mayor que cero' });
            }


            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ msg: `Producto con ID ${productId} no encontrado` });
            }

            if (product.stock < quantity) {
                return res.status(400).json({ msg: `Stock insuficiente para el producto con ID ${productId}` });
            }

            newItems.push({ product: productId, quantity });
        }


        cart.items = newItems;


        await cart.save();


          await cart.populate('items.product');
          
       
          const productsInCart = cart.items.map(item => ({ product: item.product ? item.product.title : "Producto no encontrado",
          quantity: item.quantity
        }));


        res.status(200).json({
            msg: 'Carrito actualizado correctamente',
            data: productsInCart
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al actualizar el carrito', error: err.message });
    }
});


module.exports = router;