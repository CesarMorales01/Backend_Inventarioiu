const express = require("express");
const { createMarca, getAllBrands, getMarcaById, deleteMarcaID, actualizarMarca, getMarcasActivas} = require('../controllers/marca');
const router = express.Router();
const { validarJWT }= require('../middlewares/validar-jwt')
const {validarRolAdmin} = require('../middlewares/validar-rol-admin')

// create marca
router.post("/", [validarJWT,
  validarRolAdmin], createMarca );

  // obtener todas las marcas
router.get("/", [validarJWT,
  validarRolAdmin], getAllBrands);

// obtener solo las marcas activas
router.get("/active", [validarJWT,
  validarRolAdmin], getMarcasActivas);

// obtener una marca
router.get("/:id", [validarJWT,
  validarRolAdmin], getMarcaById);

// delete una marca
router.delete("/:id", [validarJWT,
  validarRolAdmin], deleteMarcaID);

// update una marca
router.put("/:id", [validarJWT,
  validarRolAdmin], actualizarMarca);

module.exports = router;