const { Categoria, Role, Usuario, Producto } = require('../models');

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });

    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registradó en la BD`);
    }
}

const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo: ${correo} ya esta registradó en la BD`);
    }
}

const existeUsuarioPorId = async (id = '') => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id: ${id} no existe en la BD`);
    }
}

const existeCategoriaPorId = async (id = '') => {
    const existeCategoriaPor = await Categoria.findById(id);
    if (!existeCategoriaPor) {
        throw new Error(`El id: ${id} no existe en la BD`);
    }
}

const existeProductoPorId = async (id = '') => {
    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id: ${id} no existe en la BD`);
    }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`La colección ${coleccion} no es permitida, ${colecciones}`);
    }

    return true;
}

module.exports = {
    coleccionesPermitidas,
    emailExiste,
    esRolValido,
    existeCategoriaPorId,
    existeProductoPorId,
    existeUsuarioPorId
};
