const bcryptjs = require('bcryptjs');
const { response } = require("express");

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {

        // Verificar si el correo existe

        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            res.status(400).json({
                msg: 'Usuario / password no son correctos - correo'
            });
        }

        // Usuario activo

        if (!usuario.estado) {
            res.status(400).json({
                msg: 'Usuario / password no son correctos - password - false'
            });
        }

        // Verificar la contraseña

        const validPass = bcryptjs.compareSync(password, usuario.password);

        if (!validPass) {
            res.status(400).json({
                msg: 'Usuario / password no son correctos - password'
            });
        }

        // Generar el JWT

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

}

module.exports = {
    login
}