// controllers/auth.controller.js
const User = require('../models/user.model');
const Cart = require('../models/cart.model');

const profile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const cart = await Cart.findOne({ userId: userId }).populate('items.product');

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    const profileData = {
      id: user._id,
      username: user.username,
      email: user.email,
      // otros campos del perfil
    };

    const cartData = {
      items: cart ? cart.items : [],
      total: cart ? cart.total : 0,
      // otros campos del carrito
    };

    res.json({
      profile: profileData,
      cart: cartData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener el perfil del usuario' });
  }
};

module.exports = {
  profile,
  // otros métodos exportados
};
