// app.js
// require('events').EventEmitter.defaultMaxListeners = 15;

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const flash = require('connect-flash');
const db = require('./backend/config/db.config');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoStore = require('connect-mongo')
const {createHash} = require('./backend/utils/bcrypt')
const passport = require('passport')
const initializePassport = require('./backend/config/passport.config')
const GitHubStrategy = require('passport-github2').Strategy;
const multer = require('multer')
const path = require('path');
const nodemailer = require('nodemailer')
const cookieParser = require('cookie-parser');
const authMiddleware = require('./backend/middlewares/authMiddleware');


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
    path: '/',
    secure: false, // true en producción si usas HTTPS
    httpOnly: true,
  },
}));

app.use(cookieParser());

initializePassport()

app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

// Middleware
app.use(express.static(__dirname + '/frontend/public'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


// Middleware para configurar los mensajes flash
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success');
  res.locals.error_messages = req.flash('error');
  next();
});


//Views Engine require
const handlebars = require('express-handlebars')

//Views
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname+'/')
app.set('views', path.join(__dirname, 'frontend/views'));

//Public
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/images', express.static('images'));
app.use('/public/thumbnails', express.static('thumbnails'));


// Import Routes
const mongo = require('mongoose')
const productsRouter = require('./backend/routes/products.router');
const cartRouter = require('./backend/routes/cart.router');
const chatRouter = require('./backend/routes/chat.router');
const sessionsrouter = require('./backend/routes/sessions.router');
const authRoutes = require('./backend/routes/auth.router');
const mailRouter = require('./backend/routes/mail.router');
const userRouter = require('./backend/routes/user.router')
const ticketRouter = require('./backend/routes/ticket.router')
const viewsRouter = require('./backend/routes/views.router')
// const emailticket = require('./backend/routes/emailticket.router')


// Rutas
app.use('/api/prods', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/chat', chatRouter)
app.use('/api/sessions', sessionsrouter)
app.use('/api/auth', authRoutes);
app.use('/api/mail', mailRouter);
app.use('/api/ticket', ticketRouter);
app.use('/api/user', userRouter)
app.use('/api/view', viewsRouter)
// app.use('/api/emailticket', emailticket)



//Socket import
const {Server} = require('socket.io')
const io = new Server(server)


let messages = []

//Sockect **conexion socket desde el servidor **
io.on('connection', (socket)=>{
  console.log('New user conected')
  socket.emit('wellcome', 'Hola cliente, bienvenido') // mensaje para enviar del servidor al frontend o cliente

  socket.on('new-message', (data)=>{

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
