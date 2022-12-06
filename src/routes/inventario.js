const { Router } = require('express');
const { getInventarios, getInventarioByID, createInventario, updateInventario, uploadImage, deleteInventarioId, getFoto} = require('../controllers/inventario');
const { validarJWT }= require('../middlewares/validar-jwt')
const {validarRolAdmin} = require('../middlewares/validar-rol-admin')
const router = Router();

/**
 * Obtiene todos los inventarios
 */
router.get('/', [validarJWT], getInventarios);

/**
 * Obtiene un inventario por id
 */
 router.get('/:id', [validarJWT], getInventarioByID);

/**
 * Crear un inventario
 */
router.post('/', [validarJWT,
    validarRolAdmin], createInventario);

/**
 * Actualiza un inventario por id
 */
router.put('/:id', [validarJWT,
    validarRolAdmin], updateInventario);

/**
 * Sube foto el inventario
 */
router.post('/:id/upload-image', uploadImage);

/**
 * get foto de inventario
 */
router.get('/:id/image', getFoto);

// delete inventario
router.delete("/:id", [validarJWT,
    validarRolAdmin], deleteInventarioId);

module.exports = router;