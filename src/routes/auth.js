const express = require("express")
const { validationResult, check } = require('express-validator')
const bcrypt = require('bcryptjs')
const usuarioModel = require('../models/user')
const router = express.Router()
const {generarJWT} = require('../helpers/jwt')

router.post('/', [
    check('email', 'email.requerido').isEmail(),
    check('clave', 'clave.requerida').not().isEmpty()
    ], async (req = request, res = response) => {
        try{
            const errors= validationResult(req)
            if(!errors.isEmpty()){
                return res.status(400).json({mensaje: errors.array()})
            } 

           const usuario= await usuarioModel.findOne({email: req.body.email})
            if(!usuario){
               return res.status(400).json({mensaje: 'Usuario no encontrado'})
            }

            const esIgual= bcrypt.compareSync(req.body.clave, usuario.clave)
            if(!esIgual){
               return res.status(400).json({mensaje: 'Usuario no encontrado'})  
            }

            const token= generarJWT(usuario)

            res.json({
             _id: usuario._id,
             nombre: usuario.name,
             rol: usuario.rol,
             email: usuario.email,
             access_token: token
            })  

    }catch(error){
        console.log(error)
        res.status(500).json({Mensaje: 'Internal server error'})
    }
    
    
}
)

module.exports = router