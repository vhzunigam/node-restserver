const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRol } = require('../middlewares');
const {
    actualizarProducto,
    crearProducto,
    eliminarProducto,
    obtenerProducto,
    obtenerProductos } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validatos');

const router = Router();

// Obtener todos los productos
router.get('/', obtenerProductos);

// Obtener una cateogria por id
router.get('/:id', [
    check('id', 'No es un ID válido ').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

// Crear producto - privado - con cualquier rol
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id valido de mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

// Actualizar - privado - cualquiera con token
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID válido ').isMongoId(),
    check('id').custom(existeProductoPorId),
    check('categoria', 'No es un id valido de mongo').optional().isMongoId(),
    check('categoria').optional().custom(existeCategoriaPorId),
    validarCampos
], actualizarProducto);

// Delete - privado - ADMIN con token
router.delete('/:id', [
    validarJWT,
    esAdminRol,
    check('id', 'No es un ID válido ').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], eliminarProducto);

module.exports = router;