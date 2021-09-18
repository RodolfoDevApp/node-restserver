const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto,
        obtenerProductos,
        obtenerProducto,
        actualizarProducto,
        borrarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');

const { validarJWT,
        validarCampos, 
        esAdminRole} = require('../middlewares');


const router = Router();

//obtener todas las categorias
router.get('/', obtenerProductos);

//obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
], obtenerProducto);

//crear categoria - privado - cualquier persona con  un token valido 
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'no es un id valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

//actualizar - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('id', 'no es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'El id es obligatorio').not().isEmpty(),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],borrarProducto);

module.exports = router;