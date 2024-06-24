// controllers/cartController.js
const userService = require('../services/userService');

class UserController {
    async getUserProfile (req, res) {
        try {
            const userId = req.user._id;
            const data = await userService.getUserProfileAndCart(userId);
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Error al obtener datos del usuario' });
        }
    };
    

    
async updateUserProfile  (req, res)  {
    try {
        const userId = req.user._id;
        const { username, email, address } = req.body;

        const updatedProfile = await userService.updateUserProfile(userId, username, email, address);

        res.json({
            msg: 'Perfil actualizado exitosamente',
            profile: updatedProfile
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: err.message || 'Error al actualizar el perfil del usuario' });
    }
};


async getAllUsers (req, res) {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

}


module.exports = new UserController();
