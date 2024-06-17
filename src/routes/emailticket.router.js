const express = require('express');
const {Router} = express
const router = new Router()
const Ticket = require('../models/ticket.model');
const nodemailer = require('nodemailer')
const path = require('path')

// Crea el transporte
const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Agrega un nuevo endpoint para enviar el ticket por correo
router.get('/sendTicket', async (req, res) => {
    try {
        // Recupera la información del ticket del servidor
        const ticketResponse = await fetch('/api/ticket/show', {
            method: 'GET',
            credentials: 'include'
        });
        const ticketData = await ticketResponse.json();

        // Verifica si se encontraron tickets para el usuario
        if (ticketData.ticket.length === 0) {
            return res.status(404).send({ error: "No se encontraron tickets para este usuario" });
        }

        // Construye el contenido del correo con la información del ticket
        const ticket = ticketData.ticket[0]; // Suponiendo que solo se envía el primer ticket
        const createdAt = new Date(ticket.createdAt).toLocaleString();
        const ticketProducts = ticket.products.map(product => `
            <div class="infoprodsticket">
                <p>Product: ${product.productId.title}</p>
                <p>Quantity: ${product.quantity}</p>
                <p>Price: $${product.price}</p>
                <p>Total: $${product.total}</p>
            </div>
        `).join('');
        const emailContent = `
            <div> 
                <h1>Detalles del Ticket</h1>
                <p>Created At: ${createdAt}</p>
                <p>Ticket ID: ${ticket._id}</p>
                <div class="ticketprods">${ticketProducts}</div>
                <h5>Total Price: $${ticket.totalPrice}</h5>
                <p>Email: ${ticket.email}</p>
                <p>Dirección de envio: ${ticket.address}</p>
            </div>
        `;

        // Envía el correo
        const emailUser = req.query.emailUser;
        const result = await transport.sendMail({
            from: 'Luna.Store mktiielove@gmail.com',
            to: emailticket,
            subject: 'Detalles de tu Ticket de Compra',
            html: emailContent
        });

        res.send({ status: "success", result: "Email Sent" });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).send('Error al enviar el correo');
    }
});

module.exports = router;