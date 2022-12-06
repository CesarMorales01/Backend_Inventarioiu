const express = require("express")
const { createUsuario , getAllUser, getUserById, deleteUsuarioID, actualizarUsuario, getAllUserActive} = require('../controllers/usuario');
const router = express.Router()
const { check } = require('express-validator') //TODO <---
const { validateResult } = require('../validators/helpers/validateHelper')
const { validarJWT }= require('../middlewares/validar-jwt')
const {validarRolAdmin} = require('../middlewares/validar-rol-admin')

// create user
router.post("/", [
  check('name')
    .exists()
    .not()
    .isEmpty(),
    check('email')
    .exists()
    .not()
    .isEmpty(),
    check('estado')
    .exists()
    .not()
    .isEmpty(),
    check('clave')
    .exists()
    .not()
    .isEmpty(),
    check('rol')
    .exists()
    .not()
    .isEmpty(),
    validarJWT,
    validarRolAdmin,
    (req, res, next) => {
        validateResult(req, res, next)
    }
], createUsuario );

  // get all users
router.get("/", [
  validarJWT
], getAllUser);

  // get solo usuarios activos
router.get("/active", [validarJWT], getAllUserActive);

// get a user
router.get("/:id", [validarJWT], getUserById);

// delete a user
router.delete("/:id", [validarJWT,
validarRolAdmin], deleteUsuarioID);

// update a user
router.put("/:id" , [validarJWT, validarRolAdmin], actualizarUsuario);

module.exports = router;