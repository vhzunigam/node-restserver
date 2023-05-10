const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, tieneRole } = require('../middlewares');
const { actualizarCategoria, crearCategoria, eliminarCategoria, obtenerCategoria, obtenerCategorias } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validatos');

const router = Router();

// Obtener todas las categorias
router.get('/', obtenerCategorias);

// Obtener una cateogria por id
router.get('/:id', [
    check('id', 'No es un ID válido ').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

// Crear categoria - privado - con cualquier rol
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar - privado - cualquiera con token
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido ').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

// Delete - privado - ADMIN con token
router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido ').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], eliminarCategoria);

module.exports = router;