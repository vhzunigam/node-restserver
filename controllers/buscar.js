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
        const query = { _id: termino, estado: true };

        const [total, categoria] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.findById(termino)
                .populate('usuario', 'nombre')
        ]);

        return res.json({
            total,
            results: categoria ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const query = { nombre: regex, estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query).populate('usuario', 'nombre')
    ]);

    res.json({
        total,
        results: categorias
    });
}

const buscarProductos = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const query = { _id: termino, estado: true };

        const [total, producto] = await Promise.all([
            Producto.countDocuments(query),
            Producto.findById(termino)
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
        ]);

        return res.json({
            total,
            results: producto ? [producto] : []
        });
    }

    if (termino.toLocaleLowerCase() === 'disponible') {
        const query = { disponible: true, estado: true };

        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
        ]);

        return res.json({
            total,
            results: productos
        });
    }

    if (termino.toLocaleLowerCase().trim() === 'no-disponible') {
        const query = { disponible: false, estado: true };

        const [total, productos] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
        ]);

        return res.json({
            total,
            results: productos
        });
    }

    const regex = new RegExp(termino, 'i');

    const query = {
        $or: [{ nombre: regex }, { descripcion: regex }],
        $and: [{ estado: true }]
    };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ]);

    res.json({
        total,
        results: productos
    });
}

const buscarProductosPorCategoria = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const query = { categoria: termino, estado: true };

        const [total, producto] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .populate('usuario', 'nombre')
                .populate('categoria', 'nombre')
        ]);

        return res.json({
            total,
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

    const query = {
        $or: [{ categoria: categoria[0]._id }],
        $and: [{ estado: true }]
    };

    const [total, producto] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ]);

    res.json({
        total,
        results: producto
    });
}

const buscarUsuarios = async (termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const query = { _id: termino, estado: true };
        const [total, usuario] = await Promise.all([
            Usuario.countDocuments(query),
            Usuario.findById(query)
        ]);

        return res.json({
            total,
            results: usuario ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const query = {
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
    ]);

    res.json({
        total,
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