const cors = require('cors');
const express = require('express');

const {dbConnection} = require('../database/config');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        // Conexión a base de datos
        this.conenctarDB();

        // Middlewares
        this.middlewares();

        this.routes();
    }

    async conenctarDB(){
        await dbConnection();
    }

    middlewares() {
        // Cors
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server run on port ${this.port}`)
        });
    }
}

module.exports = Server;