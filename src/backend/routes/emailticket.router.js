const nodemailer = require('nodemailer');
const express = require('express');
const path = require('path');
const router = express.Router();
const Ticket = require('../models/ticket.model'); // Asegúrate de ajustar el camino al modelo de Ticket

const emailticket = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

router.post('/send-ticket-email', async (req, res) => {
    try {
        const ticketId = req.body.ticketId;

        // Busca el ticket por ID
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).send({ status: 'error', message: 'Ticket no encontrado' });
        }

        const emailUserticket = ticket.email;
        console.log(emailUserticket)
        const imagePath = path.join(__dirname, 'image', 'imgMail.jpg');

        let result = await emailticket.sendMail({
            from: 'Luna.Store mktiielove@gmail.com',
            to: emailUserticket,
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
