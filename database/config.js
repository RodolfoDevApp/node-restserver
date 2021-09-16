const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        await mongoose.connect(process.env.MONGODB_CNN,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Base de Datos online');
    } catch (error) {
        console.log(error);
        throw Error('Error al iniciar la base de datos');
    }

}

module.exports = {
    dbConnection
}