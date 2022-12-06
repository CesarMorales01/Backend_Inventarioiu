const express = require("express");
const {  getEstados, getEstadoById, createEstado, updateEstadoById, deleteEstado, getEstadosActive} = require('../controllers/estadoEquipo');
const router = express.Router()
const { validarJWT }= require('../middlewares/validar-jwt')
const {validarRolAdmin} = require('../middlewares/validar-rol-admin')

// create estado
router.post("/", [validarJWT,
  validarRolAdmin], createEstado );

  // get todos los estados
router.get("/", [validarJWT,
  validarRolAdmin], getEstados);

 // get estados activos
 router.get("/active", [validarJWT,
  validarRolAdmin], getEstadosActive);

// get estado
router.get("/:id", [validarJWT,
  validarRolAdmin], getEstadoById);

// delete estado
router.delete("/:id", [validarJWT,
  validarRolAdmin], deleteEstado);

// update estado
router.put("/:id",  [validarJWT,
  validarRolAdmin], updateEstadoById);

module.exports = router;