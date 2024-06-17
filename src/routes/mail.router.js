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
        const imagePath = path.join(__dirname, 'image', 'imgMail.jpg');
        const emailUser = req.query.emailUser; 

        let result = await transport.sendMail({
            from: 'Luna.Store mktiielove@gmail.com',
            to: emailUser,
            subject: 'Correo de bienvenida',
            html: `
            <div> 
                <h1>Bienvenid@ a Luna.Store 🦄 </h1>
                <img src="cid:imgMail"/>
            </div>`,
            attachments: [{
                filename: 'imgMail.jpg',
                path: imagePath,
                cid: 'imgMail'
            }]
        });

        res.send({ status: "success", result: "Email Sent" });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).send('Error al enviar el correo');
    }
});





module.exports = router;