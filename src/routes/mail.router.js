//Mailing
const express = require('express');
const {Router} = express
const router = new Router()
const nodemailer = require('nodemailer')
const path = require('path')





const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS

    }
})


router.get('/send', async (req, res) => {
    try {
        const imagePath = path.join(__dirname, 'image', 'laptop.jpg');
        const emailUser = req.query.emailUser; 

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





module.exports = router;