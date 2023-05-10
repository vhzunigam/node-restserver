const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'productos-categoria',
    'roles',
    'usuarios'
];

const buscarCategorias = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const categoria = await Categoria.findById(termino).populate('usuario', 'nombre');

        return res.json({
            results: categoria ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const categoria = await Categoria.find({ nombre: regex, estado: true }).populate('usuario', 'nombre');;

    res.json({
        results: categoria
    });
}

const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const producto = await Producto
            .findById(termino)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre');

        return res.json({
            results: producto ? [producto] : []
        });
    }

    if (termino.toLocaleLowerCase() === 'disponible') {
        const producto = await Producto
            .find({ disponible: true })
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre');

        return res.json({
            results: producto
        });
    }

    if (termino.toLocaleLowerCase().trim() === 'no-disponible') {
        const producto = await Producto
            .find({ disponible: false })
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre');

        return res.json({
            results: producto
        });
    }

    const regex = new RegExp(termino, 'i');

    const producto = await Producto
        .find({
            $or: [{ nombre: regex }, { descripcion: regex }],
            $and: [{ estado: true }]
        })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json({
        results: producto
    });
}

const buscarProductosPorCategoria = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const producto = await Producto
            .find({ categoria: termino, estado: true })
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre');

        return res.json({
            results: producto ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const categoria = await Categoria.find({ nombre: regex, estado: true });

    if (!categoria) {
        return res.status(400).json({
            msg: `No se encontro la categoria: ${termino}`
        });
    }

    const producto = await Producto
        .find({
            $or: [{ categoria: categoria[0]._id }],
            $and: [{ estado: true }]
        })
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json({
        results: producto
    });
}

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);

        return res.json({
            results: usuario ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: usuarios
    });
}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(500).json({
            msg: `La colección:[${coleccion}] solicitada no esta en la lista de colecciones permitidas [${coleccionesPermitidas}]`
        });
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'productos-categoria':
            buscarProductosPorCategoria(termino, res);
            break;
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;

        default:
            return res.status(500).json({
                msg: `La colección:[${coleccion}] no esta permitida`
            });
    }
}

module.exports = {
    buscar
}