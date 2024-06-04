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
 
      const filePath = `/public/images/${req.file.filename}`; // Ruta de la imagen
      const thumbnailPath = `/public/thumbnails/${req.file.filename}`; // Ruta del thumbnail
 
      // Crear thumbnail usando Sharp
      await sharp(req.file.path)
        .resize(150, 150)
        .toFile(path.join(__dirname, '../public/thumbnails', req.file.filename));
 
      product.image = filePath; // Actualiza el campo 'image' con la ruta de la imagen
      product.thumbnail = thumbnailPath; // Actualiza el campo 'thumbnail' con la ruta del thumbnail
      await product.save();
 
      res.send('Image and thumbnail uploaded and product updated successfully.');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error uploading image.');
    }
  });
