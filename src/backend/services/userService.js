// services/cartService.js
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Cart = require('../models/cart.model');

class UserService{
    async getUserProfileAndCart (userId, productId){
        const user = await User.findById(userId);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    const cart = await Cart.findOne({ userId }).populate('items.product');
    
    const profileData = {
        id: user._id,
        username: user.username,
        email: user.email,
        method: user.method,
        address: user.address,
        role: user.role
    };

    let cartData = {
        id: null,
        items: [],
        total: 0,
    };

    if (cart) {
        cartData = {
            id: cart.id,
            items: cart.items,
            total: cart.total,
        };
    }

    return {
        profile: profileData,
        cart: cartData
    };
};

async updateUserProfile (userId, username, email, address) {
    if (!username || !email || !address) {
        throw new Error('Todos los campos son obligatorios');
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username, email, address },
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        throw new Error('Usuario no encontrado');
    }

    return {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        method: updatedUser.method,
        address: updatedUser.address,
        role: updatedUser.role
    };
};

async getAllUsers ()  {
    return await User.find();
};


    }

    module.exports = new UserService();