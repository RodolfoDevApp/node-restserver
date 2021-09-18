const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        // this.usuariosPath = '/api/usuarios';
        // this.authPath = '/api/auth';

        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            categorias: '/api/categorias',
            productos: '/api/productos',
            usuarios: '/api/usuarios'
        }

        //conectar a db
        this.conectarDB();
        //Middlewares
        this.middlewares();
        //rutas de mi aplicación
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
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

        // this.app.use(this.authPath, require('../routes/auth'));  
        // this.app.use(this.usuariosPath, require('../routes/user'));  
        this.app.use(this.paths.auth, require('../routes/auth'));  
        this.app.use(this.paths.buscar, require('../routes/buscar'));  
        this.app.use(this.paths.categorias, require('../routes/categorias'));  
        this.app.use(this.paths.productos, require('../routes/productos'));  
        this.app.use(this.paths.usuarios, require('../routes/user'));  

    }  
    
    listener(){
        this.app.listen(this.port,()=>{
            console.log('Servidor correindo en puerto: ',this.port);
        });
    }
}

module.exports = Server;