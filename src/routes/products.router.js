// products.router.js
const express = require('express');
const {Router} = express
const router = new Router()
const upload = require('../config/multerConfig');
const sharp = require('sharp');
const Product = require('../models/product.model');
const path = require('path');
const User = require('../models/user.model');
const {createHash, isValidPassword} = require('../utils/bcrypt')



// Agregar producto
router.post('/newPr', async (req, res) => {
    try {
        await Product.create(req.body)
        res.status(201).send({
            msg: 'Producto agregado correctamente',
            data: req.body
        })
    } catch (err) {
        res.status(500).send({
            error: err
        })
    }
});


// Agregar imagen del producto
router.put('/upload', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
 
      const product = await Product.findById(req.body.productId);
 
      if (!product) {
        return res.status(404).send('Product not found.');
      }
 
      const filePath = `/images/${req.file.filename}`;
      const thumbnailPath = `/thumbnails/${req.file.filename}`; 
 

      await sharp(req.file.path)
        .resize(150, 150)
        .toFile(path.join(__dirname, '../public/thumbnails', req.file.filename));
 
      product.image = filePath; 
      product.thumbnail = thumbnailPath; 
      await product.save();
 
      res.send('Image and thumbnail uploaded and product updated successfully.');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error uploading image.');
    }
  });
  




// Obtener todos los productos
router.get('/allPr', async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.json(allProducts); 
    } catch (err) {
        res.status(500).send({ error: err });
    }
});


// Obtener producto por ID
router.get('/prById/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.status(200).json({
            msg: 'Producto encontrado',
            data: product
        });
    } catch (err) {
        res.status(500).send({
            error: err
        })}
});


// Eliminar producto por ID
router.delete('/prById/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndDelete(productId);
        
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.status(200).json({
            msg: 'Producto eliminado correctamente',
            data: product
        });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Actualizar producto por ID
router.put('/prById/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedData = req.body; 

        const product = await Product.findByIdAndUpdate(productId, updatedData, { new: true });

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({
            msg: 'Producto actualizado correctamente',
            data: product
        });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});




module.exports = router;
