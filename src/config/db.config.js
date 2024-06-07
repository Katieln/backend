// ***** conexion a mongoDb *******//
const mongoose = require('mongoose');

module.exports = {
    connection: null,
    connect: async () => {
        try {
            if (this.connection) return this.connection;
            this.connection = await mongoose.connect("mongodb+srv://mktiielove:prlnkt@1prkt.icbabie.mongodb.net/tienda");
            console.log('Conexión a MongoDB exitosa');
            return this.connection;
        } catch (error) {
            console.error('Error al conectar a MongoDB:', error);
            throw error;
        }
    }
};
