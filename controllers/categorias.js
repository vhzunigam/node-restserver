const { response } = require("express");

const { Categoria } = require('../models');

// Categoriras - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'nombre')
            .skip(desde)
            .limit(limite)
    ]);

    res.json({
        total,
        categorias
    });

}

// Categorira - populate {}
const obtenerCategoria = async (req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.json(categoria);
}

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        res.status(400).json({
            msg: `La categoria: ${categoriaDB.nombre} ya existe en BD`
        });
    }

    // Data a guardar

    const data = {
        nombre,
        usuario: req.usuario._id
    };

    const categoria = new Categoria(data);

    //Guardar BD
    await categoria.save();

    res.status(201).json(categoria);
}

// Actualizar categoria
const actualizarCategoria = async (req, res = response) => {
    const { id } = req.params;

    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data);

    res.json({
        categoria
    });
}

// Eliminar al categoria - estado - false
const eliminarCategoria = async (req, res = response) => {
    const { id } = req.params;

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false });

    const usuarioAuth = req.usuario;
    res.json({
        categoria,
        usuarioAuth
    });
}

module.exports = {
    actualizarCategoria,
    crearCategoria,
    eliminarCategoria,
    obtenerCategoria,
    obtenerCategorias
}