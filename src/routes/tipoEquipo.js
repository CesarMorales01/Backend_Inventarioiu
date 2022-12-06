const { Router } = require('express');
const { getTiposEquipo, getTiposEquipoActive, createTipoEquipo, getTiposEquipoById, updateTipoEquipoById, deleteTipoEquipoByID } = require('../controllers/tipoEquipo');
const { validarJWT }= require('../middlewares/validar-jwt')
const {validarRolAdmin} = require('../middlewares/validar-rol-admin')
const router = Router();

/**
 * btiene todos los tipos de equipos los cuales los usuarios
 * son activos
 */
router.get('/active', [validarJWT,
    validarRolAdmin], getTiposEquipoActive);

/**
 * Obtiene todos los tipos de equipos
 */
router.get('/',  [validarJWT,
    validarRolAdmin], getTiposEquipo);

/**
 * Obtiene un tipos de equipos por id
 */
 router.get('/:id', [validarJWT,
    validarRolAdmin], getTiposEquipoById);

/**
 * Crear un tipos de equipos
 */
router.post('/', [validarJWT,
    validarRolAdmin], createTipoEquipo);

/**
 * Actualiza un tipos de equipos por id
 */
router.put('/:id', [validarJWT,
    validarRolAdmin], updateTipoEquipoById);

/**
 * Borra un tipos de equipos por id
 */
 router.delete('/:id', [validarJWT,
    validarRolAdmin], deleteTipoEquipoByID);

module.exports = router;