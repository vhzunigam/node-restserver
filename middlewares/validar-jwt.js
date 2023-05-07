const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'Sin token en la petición'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe en BD'
            });
        }

        // Verificar si el uid esta activo

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - usuario inactivo'
            });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(401).json({
            msg: 'Token no valido'
        });
    }

    console.log(token);

}

module.exports = {
    validarJWT
}