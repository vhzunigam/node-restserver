const path = require('path');
const fs = require('fs');

const { response } = require("express");

const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require('../models');

const actualizarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({ msg: `No existe el usuario con el id ${id}` });
            }

            break;
        case 'productos':

            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({ msg: `No existe el producto con el id ${id}` });
            }

            break;

        default:
            return res.status(400).json({ msg: 'Coleccion no disponible' });
    }

    // Limpiar img previas
    if (modelo.img) {
        const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImg)) {
            fs.unlinkSync(pathImg);
        }
    }

    modelo.img = await subirArchivo(req.files, undefined, coleccion);
    await modelo.save();

    res.json(modelo);
}

const cargarArchivo = async (req, res = response) => {

    try {
        const nombre = await subirArchivo(req.files, undefined, 'imgs');

        res.json({
            nombre
        });
    } catch (msg) {
        res.status(400).json(msg);
    }
}

const mostrarImagen = async (req, res = response) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({ msg: `No existe el usuario con el id ${id}` });
            }

            break;
        case 'productos':

            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({ msg: `No existe el producto con el id ${id}` });
            }

            break;

        default:
            return res.status(400).json({ msg: 'Coleccion no disponible' });
    }

    // Limpiar img previas
    if (modelo.img) {
        const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);

        if (fs.existsSync(pathImg)) {
            return res.sendFile(pathImg);
        }
    }
    
    const pathImg = path.join(__dirname, '../assets/no-image.jpg');

    res.sendFile(pathImg);
}


module.exports = {
    actualizarImagen,
    cargarArchivo,
    mostrarImagen
}