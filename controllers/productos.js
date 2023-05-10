const { response } = require("express");

const { Producto, Categoria } = require('../models');

const obtenerProductos = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(desde)
            .limit(limite)
    ]);

    res.json({
        total,
        productos
    });

}

const obtenerProducto = async (req, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json(producto);
}

const crearProducto = async (req, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre.toUpperCase() });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto: ${productoDB.nombre} ya existe en BD`
        });
    }

    // Data a guardar
    body.nombre = body.nombre.toUpperCase();
    body.usuario = req.usuario._id

    const producto = new Producto(body);

    //Guardar BD
    await producto.save();

    res.status(201).json(producto);
}

const actualizarProducto = async (req, res = response) => {
    const { id } = req.params;

    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data);

    res.json(producto);
}

const eliminarProducto = async (req, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado: false });

    const usuarioAuth = req.usuario;
    res.json({
        producto,
        usuarioAuth
    });
}

module.exports = {
    actualizarProducto,
    crearProducto,
    eliminarProducto,
    obtenerProducto,
    obtenerProductos
}