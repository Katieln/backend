// controllers/cartController.js
const ticketService = require('../services/ticketService');
const userService = require('../services/userService');

class TicketController {
   async completePurchase  (req, res) {
    try {
        const result = await ticketService.completePurchase(req.user._id);
        res.status(200).json({ success: true, message: 'Compra completada y stock reducido correctamente', data: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

 async showTickets (userId) {
    return await Ticket.find({ userId: userId })
        .sort({ createdAt: -1 })
        .populate('products.productId');
};

  async showTickets  (req, res)  {
    try {
        const userId = req.user._id;
        const result = await ticketService.getTicketsForUser(userId);
        res.status(result.status).json(result.data);
    } catch (err) {
        console.error('Error al obtener los tickets:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


}


module.exports = new TicketController();
