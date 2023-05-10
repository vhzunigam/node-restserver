const bcryptjs = require('bcryptjs');
const { response } = require("express");

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

        res.status(200).json({
            usuario,
            token
        });
    } catch (error) {
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }

}

const googleSignIn = async (req, res = response) => {
    const { id_token } = req.body;

    try {

        const { nombre, img, correo } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: '-',
                img,
                google: true
            };

            usuario = new Usuario(data);

            await usuario.save();
        }

        // Si el usuario en bd

        if (!usuario.estado) {
            res.status(400).json({
                ok: false,
                msg: 'Ocurrio un error al autenticar el token de google'
            });
        }

        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            msg: 'Hable con el administrador, usuario bloqueado'
        });
    }

}

module.exports = {
    googleSignIn,
    login
}