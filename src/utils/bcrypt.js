const bcrypt = require('bcrypt');

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const isValidPassword = (plainPassword, hashedPassword) => {
    if (!plainPassword || !hashedPassword) {
        return false;
    }
    return bcrypt.compareSync(plainPassword, hashedPassword);
};

module.exports = { createHash, isValidPassword };
