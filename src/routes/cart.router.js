const express = require('express');
const {Router} = express
const router = new Router()
const User = require('../models/user.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const { createHash, isValidPassword } = require('../utils/bcrypt');
const isAuthenticated = require('../middlewares/authMiddleware');

// products.router.js

// Ruta para renderizar la vista de cart
router.get('/', (req, res) => {
    res.render('cart');
  });

// Ruta para agregar productos al carrito
// // Ruta para agregar productos al carrito
// router.post('/add-to-cart', async (req, res) => {
//     const { productId } = req.body;

//     // Verificar si el usuario está autenticado
//     if (!req.session.userId) {
//       return res.status(401).json({ error: 'Usuario no autenticado' });
//     }

//     try {
//       // Obtener información del usuario desde la base de datos
//       const user = await User.findById(req.session.userId);
//       if (!user) {
//         return res.status(404).json({ error: 'Usuario no encontrado' });
//       }

//       // Verificar si el producto existe en la colección de productos
//       const product = await Product.findById(productId);
//       if (!product) {
//         return res.status(404).json({ error: 'El producto no existe' });
//       }

//       // Buscar el carrito del usuario
//       let cart = await Cart.findOne({ userId: req.session.userId });
//       if (!cart) {
//         // Si el usuario no tiene un carrito, crear uno nuevo
//         cart = new Cart({ userId: req.session.userId, userEmail: user.email, items: [] });
//       }

//       const existingItemIndex = cart.items.findIndex(item => item.product.equals(productId));
//       if (existingItemIndex !== -1) {
//         cart.items[existingItemIndex].quantity += 1;
//       } else {
//         cart.items.push({ product: productId, title: product.title, quantity: 1 });
//       }

//       await cart.save();

//       res.status(200).json({ message: 'Producto agregado al carrito' });
//     } catch (error) {
//       console.error('Error al agregar producto al carrito:', error);
//       res.status(500).json({ error: 'Error interno del servidor' });
//     }
// });

///********************************************///////

// router.post('/add-to-cart', async (req, res) => {
//     const { productId } = req.body;

//     try {
//         // Verificar si el usuario está autenticado
//         if (!req.session.userId) {
//             return res.status(401).json({ error: 'Usuario no autenticado' });
//         }

//         // Obtener información del usuario desde la base de datos
//         const user = await User.findById(req.session.userId);
//         if (!user) {
//             return res.status(404).json({ error: 'Usuario no encontrado' });
//         }

//         // Verificar si el producto existe en la colección de productos
//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ error: 'El producto no existe' });
//         }

//         // Buscar el carrito del usuario
//         let cart = await Cart.findOne({ userId: req.session.userId });
//         if (!cart) {
//             // Si el usuario no tiene un carrito, crear uno nuevo
//             cart = new Cart({ userId: req.session.userId, userEmail: user.email, items: [] });
//         }

//         const existingItemIndex = cart.items.findIndex(item => item.product.equals(productId));
//         if (existingItemIndex !== -1) {
//             cart.items[existingItemIndex].quantity += 1;
//         } else {
//             cart.items.push({ product: productId, title: product.title, quantity: 1 });
//         }

//         await cart.save();

//         res.status(200).json({ message: 'Producto agregado al carrito' });
//     } catch (error) {
//         console.error('Error al agregar producto al carrito:', error);
//         res.status(500).json({ error: 'Error interno del servidor' });
//     }
// });


router.post('/add-to-cart', async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({ error: 'Usuario no autenticado' });
        }

        const { productId } = req.body;
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const userEmail = user.email;
        const userMethod = user.method;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        let cart = await Cart.findOne({ userId: userId });
        if (!cart) {
            cart = new Cart({
                method: userMethod,
                userId: userId,
                userEmail: userEmail,
                items: [{ product: productId, title: product.title, quantity: 1 }]
            });
        } else {
            const existingItem = cart.items.find(item => item.product.equals(productId));
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.items.push({ product: productId, title: product.title, quantity: 1 });
            }
        }

        await cart.save();
        res.json({ message: 'Producto agregado correctamente al carrito' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

  
  
  

/*************************************************************/

// Obtener todos los productos del carrito para un usuario específico
router.get('/ByUser/:userId', async (req, res) => {
    try {
        // Obtener el ID del usuario de los parámetros de la solicitud
        const userId = req.params.userId;

        // Buscar el carrito del usuario y poblar la referencia al producto
        const cart = await Cart.findOne({ userId }).populate('items.product');

        if (!cart) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }

        // Extraer los productos del carrito
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
        const requestedQuantity = req.body.quantity || 1; // Cantidad solicitada (por defecto 1 si no se especifica)

        // Verificar si el userId es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send({ error: 'ID de usuario inválido' });
        }

        // Verificar si el producto existe en la colección de productos
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


// // Agregar producto a carrito
// router.post('/pr', async (req, res) => {
//     try {
//         // Obtener el ID del producto a agregar al carrito
//         const productId = req.body.productId;
//         const requestedQuantity = req.body.quantity || 1; // Cantidad solicitada (por defecto 1 si no se especifica)

//         // Verificar si el producto existe en la colección de productos
//         const product = await Product.findById(productId);

//         // Si el producto no existe, devolver un mensaje de error
//         if (!product) {
//             return res.status(404).send({ error: 'El producto no existe' });
//         }

//         // Verificar si hay suficiente stock del producto
//         if (product.stock < requestedQuantity) {
//             return res.status(400).send({ error: 'Stock insuficiente para el producto' });
//         }

//         // Obtener el carrito del usuario (puedes obtenerlo según la sesión del usuario, el ID del usuario, etc.)
//         let cart = await Cart.findOne({ userId: req.body.userId });

//         // Si el usuario no tiene un carrito, crear uno nuevo
//         if (!cart) {
//             cart = new Cart({ userId: req.body.userId, items: [] });
//         }

//         // Verificar si el producto ya está en el carrito
//         const existingItemIndex = cart.items.findIndex(item => item.product.equals(productId));

//         // Si el producto ya está en el carrito, aumentar la cantidad
//         if (existingItemIndex !== -1) {
//             const newQuantity = cart.items[existingItemIndex].quantity + requestedQuantity;
//             // Verificar si hay suficiente stock para la nueva cantidad
//             if (product.stock < newQuantity) {
//                 return res.status(400).send({ error: 'Stock insuficiente para la cantidad solicitada' });
//             }
//             cart.items[existingItemIndex].quantity = newQuantity;
//         } else {
//             // Si el producto no está en el carrito, verificar si hay suficiente stock y agregarlo con la cantidad solicitada
//             cart.items.push({ product: productId, quantity: requestedQuantity });
//         }

//         // Guardar el carrito actualizado
//         await cart.save();

//         // Poblar la referencia al producto para obtener el título
//         await cart.populate('items.product');

//         // Extraer los productos del carrito con el título del producto
//         const productsInCart = cart.items.map(item => ({
//             product: item.product ? item.product.title : "Producto no encontrado",
//             quantity: item.quantity
//         }));

//         res.status(201).send({
//             msg: 'Producto agregado correctamente al carrito',
//             data: productsInCart
//         });
//     } catch (err) {
//         res.status(500).send({ error: err.message });
//     }
// });


/*************************************************************/



// Eliminar todos los productos del carrito de un usuario específico
router.delete('/:userId', async (req, res) => {
    try {
        // Obtener el ID del usuario de los parámetros de la solicitud
        const userId = req.params.userId;

        // Buscar el carrito del usuario
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }

        // Vaciar el carrito
        cart.items = [];

        // Guardar el carrito actualizado
        await cart.save();

        res.status(200).json({ msg: 'Carrito vaciado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error al vaciar el carrito' });
    }
});



/*************************************************************/



// Eliminar un producto específico del carrito de un usuario
router.delete('/:userId/product/:productId', async (req, res) => {
    try {
        // Obtener el ID del usuario y el ID del producto de los parámetros de la solicitud
        const userId = req.params.userId;
        const productId = req.params.productId;

        // Buscar el carrito del usuario
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }

        // Filtrar el producto a eliminar del carrito
        cart.items = cart.items.filter(item => !item.product.equals(productId));

        // Guardar el carrito actualizado
        await cart.save();

        // Poblar la referencia al producto para obtener el título
        await cart.populate('items.product');

        // Extraer los productos del carrito con el título del producto
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



// Actualizar la cantidad de un producto en el carrito
router.put('/:userId/product/:productId', async (req, res) => {
    try {
        // Obtener el ID del usuario, el ID del producto, y la nueva cantidad de los parámetros y el cuerpo de la solicitud
        const userId = req.params.userId;
        const productId = req.params.productId;
        const { quantity } = req.body;

        // Validar la cantidad
        if (quantity <= 0) {
            return res.status(400).json({ msg: 'La cantidad debe ser mayor que cero' });
        }

        // Buscar el carrito por ID de usuario
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }

        // Buscar el índice del producto en el carrito
        const itemIndex = cart.items.findIndex(item => item.product.equals(productId));

        if (itemIndex === -1) {
            return res.status(404).json({ msg: 'Producto no encontrado en el carrito' });
        }

        // Verificar el stock del producto
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ msg: 'Stock insuficiente para la cantidad solicitada' });
        }

        // Actualizar la cantidad del producto en el carrito
        cart.items[itemIndex].quantity = quantity;

        // Guardar el carrito actualizado
        await cart.save();

        // Poblar la referencia al producto para obtener el título
        await cart.populate('items.product');

        // Extraer los productos del carrito con el título del producto
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



// Actualizar el carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
        // Obtener el ID del carrito de los parámetros de la solicitud
        const cartId = req.params.cid;
        const { products } = req.body;

        // Validar que se haya proporcionado un arreglo de productos
        if (!products || !Array.isArray(products)) {
            return res.status(400).json({ msg: 'Se requiere un arreglo de productos' });
        }

        // Buscar el carrito por ID
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.status(404).json({ msg: 'Carrito no encontrado' });
        }

        // Crear un nuevo arreglo de items para el carrito actualizado
        const newItems = [];

        for (const item of products) {
            const { productId, quantity } = item;

            // Validar la cantidad
            if (quantity <= 0) {
                return res.status(400).json({ msg: 'La cantidad debe ser mayor que cero' });
            }

            // Verificar el stock del producto
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ msg: `Producto con ID ${productId} no encontrado` });
            }

            if (product.stock < quantity) {
                return res.status(400).json({ msg: `Stock insuficiente para el producto con ID ${productId}` });
            }

            // Agregar el producto al nuevo arreglo de items
            newItems.push({ product: productId, quantity });
        }

        // Actualizar el carrito con el nuevo arreglo de items
        cart.items = newItems;

        // Guardar el carrito actualizado
        await cart.save();

          // Poblar la referencia al producto para obtener el título
          await cart.populate('items.product');
          
          // Extraer los productos del carrito con el título del producto
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