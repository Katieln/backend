# Mi Aplicación de Productos

Esta es una aplicación web simple para mostrar una lista de productos. Los usuarios pueden ver los detalles de cada producto y agregarlos a su carrito de compras.

## Características

- Muestra una lista de productos con su imagen, título, descripción y precio.
- Permite a los usuarios ver detalles completos de cada producto.
- Los usuarios pueden agregar productos a su carrito de compras.
- Los usuarios pueden ver los productos en su carrito y la cantidad total a pagar.
- Funcionalidad básica de autenticación para usuarios registrados.
- Interfaz de usuario limpia y fácil de usar.

## Tecnologías Utilizadas

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB
- **Autenticación**: Passport.js (Local y GitHub OAuth)
- **Despliegue**: Heroku
- **Dependencies**:    
    "bcrypt": "^5.1.1",
    "commander": "^12.1.0",
    "connect-flash": "^0.1.1",
    "connect-mongo": "^5.1.0",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-handlebars": "^7.1.2",
    "express-session": "^1.18.0",
    "joi": "^17.13.1",
    "mongoose": "^8.4.1",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.13",
    "passport": "^0.7.0",
    "passport-github2": "^0.1.12",
    "passport-local": "^1.0.0",
    "sharp": "^0.33.4",
    "socket.io": "^4.7.5",
    "stripe": "^15.10.0"

//*******************************************************************************//

## Estructura

- **Config**
db.config.js -> conexion a la base de datos mongodb
multer.config.js -> config de multer para imagenes 
passport.config.js -> config passport-local passport github autenticación

- **Controllers**
auth.controller.js -> controlador de autenticación

- **Middlewares**
authMiddleware.js -> middleware de autenticación

- **Models**
cart.model.js -> modelo de cart; caracteristicas de datos para el cart
pruduct.model.js -> modelo de pruduct; caracteristicas de datos para el pruduct
ticket.model.js -> modelo de ticket; caracteristicas de datos para el ticket
user.model.js -> modelo de user; caracteristicas de datos para el user


//******************************** *** Public *** ********************************//

-% Frontend **Public**
  ~ **css**
  Estilos diseño Frontend 

  ~ **images**
  Imagenes guardadas de productos, desde postman por la ruta: router.post(/api/prods/upload)

  ~ **js**
  cart.js -> 
        /// *** Obtener datos y cart del usuario autenticado *** // fetch' (/api/user/profile', method: 'GET' credentials: 'include')
        /// *** Renderizar los productos del carrito *** //
        /// *** Funcionalidad Boton increase *** //  fetch ('/api/cart/add-to-cart', method: 'POST)
        /// *** Funcionalidad Boton decrease *** //  fetch ('/api/cart/remove-from-cart', method: 'POST)
        /// *** Boton Confirmar Compra Total **** //  fetch ('/api/ticket/complete-purchase', method: 'POST credentials: 'include') 

  chat.js -> codigo cliente-forntend  para el chat con websocket 

  mail.js -> codigo cliente-forntend para el envio del email ingresado en input 

  products.js ->  
        /// *** Renderizar todos los productos filtrados por category price y ordenados sortBy *** //
        /// *** Boton comprar *** /// fetch ('/api/cart/add-to-cart', method: 'POST)

  ticket.js -> 
       /// *** Renderizar ticket *** /// fetch ('/api/ticket/show', method: 'POST)
       
  user.js -> 
       /// *** Mostrar en pantalla autenticación *** /// fetch ('/api/auth/check-auth')
       /// *** mostrar usuario no conectado logout *** // fetch ('/api/auth/logout', method: 'GET credentials: 'include')
       /// *** mostrar usuario conectado github *** // window.location.href = '/api/auth/github'


//*******************************************************************************//

- **Routes**
 ~ image -> carpeta iamgen envio de email
auth.router.js ->
cart.router.js -> 
chat.router.js -> 
mail.router.js -> 
products.router.js ->
sessions.router.js -> 
ticket.router.js ->
user.router.js ->
views.router.js ->
// Vista profile
router.get('/profile', (req, res) => {
    res.render('profile')
});

// Vista de registro
router.get('/register', (req, res) => {
    res.render('register');
  });

// Vista de cart
router.get('/cart', (req, res) => {
    res.render('cart')
});

// vista de productos
router.get('/products', (req, res) => {
    res.render('products');
});

// vista de ticket
router.get('/ticket', (req, res) => {
    res.render('ticket');
});

//  vista de mail
router.get('/mail', (req, res) => {
    res.render('mail');
  });





