const express = require('express');
const cors = require('cors');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        //Middlewares
        this.middlewares();
        //rutas de mi aplicación
        this.routes();
    }

    middlewares(){
        //cors
        this.app.use( cors());
        //lectura y parseo del body
        this.app.use(express.json());
        //directorio Publico
        this.app.use(express.static('public'));
    }

    routes() {

        this.app.use(this.usuariosPath, require('../routes/user'));  
    }  
    
    listener(){
        this.app.listen(this.port,()=>{
            console.log('Servidor correindo en puerto: ',this.port);
        });
    }
}

module.exports = Server;