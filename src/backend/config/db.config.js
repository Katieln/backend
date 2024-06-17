// ***** conexion a mongoDb *******//
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL;

module.exports = {
    connection: null,
    connect: async () => {
        try {
            if (this.connection) return this.connection;
            this.connection = await mongoose.connect(MONGODB_URL);
            console.log('Conexión a MongoDB exitosa');
            return this.connection;
        } catch (error) {
            console.error('Error al conectar a MongoDB:', error);
            throw error;
        }
    }
};
