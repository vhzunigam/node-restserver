const { Router } = require('express');
const { check } = require('express-validator');

const { actualizarImagenCloudinary, cargarArchivo, mostrarImagen } = require('../controllers/uploads');
const { validarArchivo, validarCampos } = require('../middlewares');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser un id valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen);

router.post('/', validarArchivo, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id debe ser un id valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);
// ], actualizarImagen);

module.exports = router;