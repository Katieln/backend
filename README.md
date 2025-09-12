# My Product Application

This is a layered-architecture e-commerce web application with both backend and frontend programming. It allows users to purchase products, add them to the cart, and request home delivery. Users can browse products, add them to their shopping cart, and generate a purchase ticket.

npm init -y
npm i express
npm start

http://localhost:8080/api/view/register
registrarse primero.
http://localhost:8080/api/auth/login
http://localhost:8080/api/view/products
http://localhost:8080/api/view/cart



## Features

-Displays a list of products with their image, title, description, and price.

-Allows users to view full details of each product.

-Users can add products to their shopping cart.

-Users can view the products in their cart and the total amount to pay.

-Authentication functionality for registered users.

-Clean and user-friendly interface.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB
- **Autenticación**: Passport.js (Local y GitHub OAuth)
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

## Structure

# ** Frontend -> public & views
# ** Backend -> config, middlewares, socket, utils, models, controllers, services,routes.

## Backend:

# **Config**
db.config.js → MongoDB database connection

multer.config.js → Multer configuration for images

passport.config.js → Passport Local & GitHub authentication config

# **Middlewares**
authMiddleware.js -> authentication middleware

# ** socket **
socket.js -> ebSocket server enabling real-time communication between clients and server, handling message persistence in the database.

# ** Utils **
bcrypt.js → password encryption

# **Models**
*cart.model.js -> cart model; cart data structure
*pruduct.model.js -> product model; product data structure
*ticket.model.js -> ticket model; ticket data structure
*user.model.js -> user model; user data structure

# **Controllers** Handle HTTP request/response logic
auth.controller.js -> authentication controller
cart.controller.js -> logic for adding/removing products from the cart
user.controller.js -> logic for retrieving user and cart data
ticket.controller.js -> logic for creating and retrieving tickets
product.controller.js -> logic for creating new products and uploading product images

# ** services ** Business logic and DB interactions
cartService.js -> cart DB interactions (add/remove products)
userService.js -> user and cart DB interactions
ticketService.js -> ticket and user DB interactions
productService.js -> product DB interactions

# **Routes** Define endpoints and connect controllers
 ~ image -> carpeta iamgen envio de email
auth.router.js ->
* POST: register, login
* GET: login, logout, GitHub, check-auth


cart.router.js -> 
* POST: add-to-cart, remove-from-cart (used in frontend fetch calls)
* POST: /pr (add product to cart backend)
* GET: ByUser (get cart by user), :cid (get cart by cartID)
* PUT: :userId/product/:productId (update product qty in cart by userID), :cid (update cart by cartID)
* DELETE: :userId (delete all products in user’s cart), :userId/product/:productId (remove product from cart by user)


chat.router.js ->
* GET: chat

mail.router.js -> 
* ruta get: /send email 
en dotenv {user: process.env.EMAIL_USER,  pass: process.env.EMAIL_PASS}
emailUser = req.query.emailUser -> public/mail.js y mail.handlebars


products.router.js ->
* post: newPr (add new product)
* put: upload (add product image)
* get: allPr (get all products), prById/:id (get product by ID)
* delete: prById/:id (delete product by ID)
* put: prById/:id (update product by ID)

sessions.router.js -> 
* ruta get: github

ticket.router.js ->
* ruta post: complete-purchase (create ticket)
* ruta get: show (retrieve ticket info)

user.router.js ->
* ruta get: profile (user info, profile & cart), allU (all users info)

views.router.js ->
* ruta get: profile, register, cart, products, ticket, mail, 


## Frontend:


//******************************** *** Public *** ********************************//
# % **Public** 

  ~ **css**
  frontend styles 

  ~ **images**
  product images (uploaded via Postman using /api/prods/upload)
  
  ~ **js**
  cart.js -> 
        /// *** Obtener datos y cart del usuario autenticado *** // fetch' (/api/user/profile', method: 'GET' credentials: 'include')
        /// *** Renderizar los productos del carrito *** //
        /// *** Funcionalidad Boton increase *** //  fetch ('/api/cart/add-to-cart', method: 'POST)
        /// *** Funcionalidad Boton decrease *** //  fetch ('/api/cart/remove-from-cart', method: 'POST)
        /// *** Boton Confirmar Compra Total **** //  fetch ('/api/ticket/complete-purchase', method: 'POST credentials: 'include') elimina cantidad stock de products

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


# ** Views **
html de vistas
main.handlebars navbar, login, logout, login with github, info usuario conectado no conectado
cart, chat, login, mail, products, profile, register, ticket



