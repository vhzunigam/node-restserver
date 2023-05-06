const cors = require('cors');
const express = require('express');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        // Middlewares
        this.middlewares();

        this.routes();
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