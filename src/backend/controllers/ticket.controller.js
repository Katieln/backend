// controllers/cartController.js
const ticketService = require('../services/ticketService');

class TicketController {
   async completePurchase  (req, res) {
    try {
        const result = await ticketService.completePurchase(req.user._id);
        res.status(200).json({ success: true, message: 'Compra completada y stock reducido correctamente', data: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



}


module.exports = new TicketController();
