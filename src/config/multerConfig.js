// config/multerConfig.js
// config/multerConfig.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images')); // Guarda las imágenes en la carpeta 'images'
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nombra las imágenes con un timestamp y el nombre original del archivo
  }
});

const upload = multer({ storage: storage });

module.exports = upload;



