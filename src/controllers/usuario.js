const { request, response } = require('express');
const usuarioModel = require('../models/user');
const bcrypt = require('bcryptjs')

const createUsuario = async (req = request, res = response) => {
    try{
        const nombre = req.body.name;
        const query = { name: nombre}; 
        const estadoBD = await usuarioModel.findOne(query);
        if(estadoBD){
            return res.status(400).json({msg: 'Ya existe nombre de usuario.'});
        }
        const mail = req.body.email;
        const query1 = { email: mail}; 
        const estadoBD1 = await usuarioModel.findOne(query1);
        if(estadoBD1){
            return res.status(400).json({msg: 'Ya existe email'});
        }
        const body = req.body;
        // Se encripta la clave.
        const salt = bcrypt.genSaltSync();
        const getClave=req.body.clave;
        const clave = bcrypt.hashSync(getClave, salt);
        body.clave= clave 
        const usuario = new usuarioModel( body )
        await usuario.save();
        res.status(201).json(usuario);
    }catch(e){
        return res.status(500).json({error: e});
    }
}

const getAllUser = async (req = request, res = response) => {
    try{
        const result = await usuarioModel.find();
        res.json(result);
    } catch (e){
        return res.status(500).json({mensaje: e})
    }
}

// consultar solo usuarios activos

const getAllUserActive = async (req = request, res = response) => {
    try{
        const query ={"estado": true}
        const result = await usuarioModel.find(query);
        res.json(result);
    } catch (e){
        return res.status(500).json({mensaje: e})
    }
}

const getUserById = async (req = request, res = response) => {
    const { id } = req.params;
    usuarioModel
      .findById(id)
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
}

const deleteUsuarioID = async (req = request, res = response) => {
   try {
    const id = req.params.id;
    const usu = await usuarioModel.findByIdAndDelete(id);
    res.json(usu);
   }catch (e){
        return res.status(500).json({mensaje: e})
    } 
}

const actualizarUsuario = async (req = request, res = response) => {
    try{
        const { id } = req.params;
        const {...data } = req.body;// destructuring, spread (...)
        
        const usuarioBD = await usuarioModel.findById(id)
        if(usuarioBD==null){
            return res.status(404).json({
                msj: "No existe el usuario!"
            })
        }
        data.fechaCreacion = usuarioBD.fechaCreacion
        data.fechaActualizacion = new Date()
        const usuario = await usuarioModel.findByIdAndUpdate(id, data, {new : true});
        res.status(201).json(usuario);
    }catch(e){
        return res.status(500).json({msg: e});
    }
}

module.exports = { createUsuario , getAllUser, getUserById, deleteUsuarioID, actualizarUsuario, getAllUserActive }