const { request, response } = require('express');

const usuariosGet = (req = request, res = response) => {
    const query = req.query;

    res.json({
        msg: 'Get Api desde el controlador'
    });
}

const usuariosPost = (req = request, res = response) => {
    const {nombre, edad} = req.body;
    res.json({
        msg: 'Post Api desde el controlador',
        nombre,
        edad
    });
}

const usuariosPut = (req = request, res = response) => {
    const id = req.params.id;

    res.json({
        msg: 'Put Api desde el controlador',
        id
    });
}

const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'Patch Api desde el controlador'
    });
}

const usuariosDelete = (req = request, res = response) => {
    res.json({
        msg: 'Delete Api desde el controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
};