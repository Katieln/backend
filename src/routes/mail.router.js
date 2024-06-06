//Mailing
const express = require('express');
const {Router} = express
const router = new Router()
const nodemailer = require('nodemailer')
const path = require('path')


// Ruta para renderizar la vista de cart
router.get('/', (req, res) => {
    res.render('mail');
  });



const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
        // user: process.env.EMAIL_USER, // Usar variables de entorno
        // pass: 
    }
})


router.get('/send', async (req, res) => {
    try {
        const imagePath = path.join(__dirname, 'image', 'laptop.jpg');
        const emailUser = req.query.emailUser; // Obtén el correo electrónico del parámetro de la URL

        let result = await transport.sendMail({
            from: 'Luna mktiielove@gmail.com',
            to: emailUser,
            subject: 'Correo de bienvenida',
            html: `
            <div> 
                <h1>Bienvenid@ Gracias por tu compra</h1>
                <img src="cid:laptop"/>
            </div>`,
            attachments: [{
                filename: 'laptop.jpg',
                path: imagePath,
                cid: 'laptop'
            }]
        });

        res.send({ status: "success", result: "Email Sent" });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).send('Error al enviar el correo');
    }
});


// // En tu archivo de enrutador
// router.post('/send', async (req, res) => {
//     const { email } = req.body; // Obtener el correo electrónico del cuerpo de la solicitud

//     try {
//         const imagePath = path.join(__dirname, 'image', 'laptop.jpg');

//         let result = await transport.sendMail({
//             from: 'Luna mktiielove@gmail.com',
//             to: email,
//             subject: 'Correo de bienvenida',
//             html: `
//             <div> 
//                 <h1>Bienvenid@ Gracias por tu compra</h1>
//                 <img src="cid:laptop"/>
//             </div>`,
//             attachments: [{
//                 filename: 'laptop.jpg',
//                 path: imagePath,
//                 cid: 'laptop'
//             }]
//         });

//         res.send({ status: "success", result: "Email Sent" });
//     } catch (error) {
//         console.error('Error al enviar el correo:', error);
//         res.status(500).send('Error al enviar el correo');
//     }
// });



module.exports = router;