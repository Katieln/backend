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

# **Config**
db.config.js -> conexion a la base de datos mongodb
multer.config.js -> config de multer para imagenes 
passport.config.js -> config passport-local passport github autenticación

# **Controllers**
auth.controller.js -> controlador de autenticación

# **Middlewares**
authMiddleware.js -> middleware de autenticación

# **Models**
cart.model.js -> modelo de cart; caracteristicas de datos para el cart
pruduct.model.js -> modelo de pruduct; caracteristicas de datos para el pruduct
ticket.model.js -> modelo de ticket; caracteristicas de datos para el ticket
user.model.js -> modelo de user; caracteristicas de datos para el user


//******************************** *** Public *** ********************************//
# % **Public** Frontend

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

# **Routes**
 ~ image -> carpeta iamgen envio de email
auth.router.js ->
* ruta post: register, login
* ruta get: login, logout, github, checkauth


cart.router.js -> 
* ruta post: add-to-cart, remove-from-cart, <-- estas son las rutas que se usan desde fetch en frontend
* ruta post: /pr(agregar producto al cart backend)
* ruta get: ByUser(obtener cart por usuario backend), :cid (obtener cart por cartID backend),
* ruta put: :userId/product/:productId(Actualizar cantidad de un producto por usuerID en el cart backend), :cid(actualizar cart por cartID)
* ruta delete: :userID(eliminar todos los productos del cart del usuario backend), :userId/product/:productId(eliminar un producto del cart de un usuairo backend)


chat.router.js ->
* ruta get: chat 


mail.router.js -> 
* ruta get: /send email 
en dotenv {user: process.env.EMAIL_USER,  pass: process.env.EMAIL_PASS}
emailUser = req.query.emailUser -> public/mail.js y mail.handlebars


products.router.js ->
* ruta post: newPr (agregar producto a la tienda)
* ruta put: upload (agregar imagen al prodcuto)
* ruta get: allPr (obtener todos los products), prById/:id(obtner producto por su Id)
* ruta delete: prById/:id (eliminar producto por su Id)
* ruta put: prById/:id (actualizar info del producto por su Id)

sessions.router.js -> 
* ruta get: github

ticket.router.js ->
* ruta post: complete-purchase (crear ticket)
* ruta get: show (obtener info del ticket)

user.router.js ->
* ruta get: profile (obtener info del usuario, profile y cart), allU(obetenr info todos los usuarios)

views.router.js ->
* ruta get: profile, register, cart, products, ticket, mail, 

# ** Utils **
bcrypt.js -> encriptar contraseña

# ** Views **
html de vistas
main.handlebars navbar, login, logout, login with github, info usuario conectado no conectado
cart, chat, login, mail, products, profile, register, ticket



