const { Router } = require('express');
const { check } = require('express-validator');

const { cargarArchivos, actualizarImagen, mostrarImg, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivo, validarCampos } = require('../middlewares');

const router = Router();

router.post('/', validarArchivo, cargarArchivos);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary);
// ], actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImg);

module.exports = router;