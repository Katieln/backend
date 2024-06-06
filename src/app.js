// app.js
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors')
const db = require('./config/db.config');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoStore = require('connect-mongo')
const {createHash} = require('../src/utils/bcrypt')
const passport = require('passport')
// const initPassport = require('./config/github.config')
const initializePassport = require('./config/passport.config')
const GitHubStrategy = require('passport-github2').Strategy;
const multer = require('multer')
const path = require('path');
const nodemailer = require('nodemailer')


const http = require('http');
const server = http.createServer(app);

//iniciar session-express
// Middleware para sesiones
app.use(session({
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://mktiielove:prlnkt@1prkt.icbabie.mongodb.net/tienda',
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 día
    secure: false, // true en producción si usas HTTPS
    httpOnly: true,
  },
}));



initializePassport()

app.use(passport.initialize())
app.use(passport.session())


// Middleware
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


//Views Engine require
const handlebars = require('express-handlebars')

//Views
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname+'/')
app.set('views', path.join(__dirname, 'views'));

//Public
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/images', express.static('images'));
app.use('/public/thumbnails', express.static('thumbnails'));


// Import Routes
const mongo = require('mongoose')
const productsRouter = require('./routes/products.router');
const cartRouter = require('./routes/cart.router');
const userRouter = require('./routes/users.router');
const chatRouter = require('./routes/chat.router');
const sessionsrouter = require('./routes/sessions.router')
const authRoutes = require('./routes/auth.router');
const mailRouter = require('./routes/mail.router')

// Rutas
app.use('/api/prods', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/sessions', sessionsrouter)
app.use('/api/auth', authRoutes);
app.use('/api/mail', mailRouter);


//Socket import
const {Server} = require('socket.io')
const io = new Server(server)


let messages = []

//Sockect **conexion socket desde el servidor **
io.on('connection', (socket)=>{
  console.log('New user conected')
  socket.emit('wellcome', 'Hola cliente, bienvenido') // mensaje para enviar del servidor al frontend o cliente

  socket.on('new-message', (data)=>{
    console.log(data)
    messages.push(data)
    io.sockets.emit('messages-all', messages)
  })
})


// Iniciar el servidor
const PORT = 8080 || process.env.PORT

server.listen(PORT, async () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
    try {
        await db.connect(); // Conectar a la base de datos
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
});
