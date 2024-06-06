// routes/user.router.js

const express = require('express');
const {Router} = express
const router = new Router()
const User = require('../models/user.model');
const {createHash, isValidPassword} = require('../utils/bcrypt')
const passport = require('passport');

/***************** Register Local*********************/

// Ruta para renderizar la vista de registro
router.get('/register', (req, res) => {
  res.render('register');
});

// Registrar un nuevo usuario y mostrar los datos ingresados
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, phone, lastName } = req.body;

    const method = 'local';

    // Verificar si ya existe un usuario con el mismo nombre de usuario o correo electrónico
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json({ error: 'El nombre de usuario o correo electrónico ya está en uso' });
    }

    // Crear un nuevo usuario
    const newUser = new User({
      method,
      username,
      email,
      password: createHash(password), // Encriptar la contraseña aquí
      phone,
      lastName
    });

    await newUser.save();

    // Renderizar la vista con los datos del usuario
    res.render('register', { user: { email, username, phone, lastName } });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


/***************** LOGIN Local *********************/


// Ruta para renderizar la vista de login
router.get('/login', (req, res) => {
  res.render('login', { user: req.session.user });
});

// POST login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      // Buscar el usuario por email
      const user = await User.findOne({ email });

      // Si el usuario no existe, devolver un error
      if (!user) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Verificar la contraseña
      if (!isValidPassword(password, user.password)) {
          return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
      }

      // Iniciar sesión
      req.session.userId = user._id;
      req.session.user = { email: user.email, username: user.username };

      // Enviar una respuesta exitosa con los datos del usuario
      res.status(200).json({ message: 'Inicio de sesión exitoso', user });

  } catch (error) {
      console.error('Error al iniciar sesión:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
});





// Middleware para proteger rutas
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

// Ruta protegida que muestra los datos del usuario
// app.get('/profile', isAuthenticated, async (req, res) => {
//   try {
//     const userId = req.session.userId;
//     const user = await User.findById(userId);
//     res.render('profile', { user });
//   } catch (error) {
//     console.error('Error al obtener datos del usuario:', error);
//     res.status(500).json({ error: 'Error interno del servidor' });
//   }
// });



// Ruta para manejar el envío del formulario de login
router.post('/login1', (req, res) => {
  const { email, password } = req.body;
  res.render('login', { user: { email, password } });
});




module.exports = router;


// module.exports = router;


// router.post('/register', passport.authenticate('register', { failureRedirect: '/user/failedregister' }), (req, res) => {
//   res.send('Usuario registrado');
// });

// router.get('/failedregister', (req, res) => {
//   res.send('Registro fallido');
// });

// router.post('/login', passport.authenticate('login', { failureRedirect: '/user/failedlogin' }), (req, res) => {
//   req.session.user = req.user.email;
//   res.send('Usuario conectado');
// });

// router.get('/failedlogin', (req, res) => {
//   res.send('Inicio de sesión fallido');
// });

// module.exports = router;



// Otros endpoints para la gestión de usuarios, como inicio de sesión, actualización de perfil, etc.

// // // Ruta para registrar un nuevo usuario
// router.post('/registerH', async (req, res) => {
//     try {
//         let userNew = req.body;
//         userNew.password = createHash(userNew.password);
//         const newUser = new users(userNew);
//         await newUser.save();
//         res.status(201).send({ message: 'User created', userNew: newUser });
//     } catch (error) {
//         res.status(500).send({ error: 'Error creating user' });
//     }
// });

// router.post('/loginH', async (req, res) => {
//     try {
//         let userNew = req.body;
//         let userFound = await users.findOne({ email: userNew.email });

//         if (userFound) {
//             if (!isValidPassword(userFound, userNew.password)) {
//                 return res.send('Usuario Incorrecto');
//             }
//             req.session.user = {
//                 id: userFound._id,
//                 name: userFound.name
//             };
//             return res.send('Usuario logueado correctamente');
//         }
//         res.send('Usuario No encontrado');
//     } catch (error) {
//         res.status(500).send('Error en el servidor');
//     }
// });
  

//**************************************************************************************************************//


// router.get('/loginView', (req,res) =>{
//     res.render('login')
// })
// // Ruta para iniciar sesión
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Buscar el usuario por email
//         const user = await User.findOne({ email: email });

//         // Verificar si el usuario existe y la contraseña es correcta
//         if (user && user.password === password) {
//             // Almacenar la información del usuario en la sesión
//             req.session.user = {
//                 id: user._id,
//                 name: user.name
//             };

//             res.status(200).send({ message: `Usuario ${user.name} conectado` });
//         } else {
//             res.status(401).send({ error: 'Email o contraseña incorrectos' });
//         }
//     } catch (err) {
//         res.status(500).send({ error: 'Error en el servidor' });
//     }
// });

// // Ruta protegida
// router.get('/protected', (req, res) => {
//     if (req.session.user) {
//         res.send(`Usuario ${req.session.user.name} conectado`);
//     } else {
//         res.status(401).send('No autorizado');
//     }
// });

// // Ruta para iniciar sesión
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // Buscar el usuario por email
//         const user = await User.findOne({ email: email });

//         // Verificar si el usuario existe y la contraseña es correcta
//         if (user && user.password === password) {
//             // Almacenar la información del usuario en la sesión
//             req.session.user = {
//                 id: user._id,
//                 name: user.name
//             };

//             res.status(200).send({ message: `Usuario ${user.name} conectado` });
//         } else {
//             res.status(401).send({ error: 'Email o contraseña incorrectos' });
//         }
//     } catch (err) {
//         res.status(500).send({ error: 'Error en el servidor' });
//     }
// });



// router.get('/registerView', (req,res) =>{
//     res.render('register')
// })

// router.get('/profileView', (req,res) =>{
//     res.render('profile')
// })


// module.exports = router;
