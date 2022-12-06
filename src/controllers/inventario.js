const { request, response } = require('express');
const Inventario = require('../models/inventario');
const Usuario = require('../models/user');
const marcaModel = require('../models/marca');
const estadoModel = require('../models/estadoEquipo');
const tipoEquipoModel = require('../models/tipoEquipo');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');


/**
 * Consultar todos inventarios
 */
const getInventarios = async (req, res = response) => {
    try{
        const query = {};
        const inventariosBD = await Inventario.find(query);
        res.json(inventariosBD);
    }catch(e){
        return res.status(500).json({
            error: e
        })
    }
}

/**
 * Consultar inventario ID
 */
 const getInventarioByID = async (req = request, res = response) => {
    try{
        const { id } = req.params;
        const query = { _id: id};
        const inventarioBD = await Inventario.findOne(query);
        res.json(inventarioBD);
    }catch(e){
        return res.status(500).json({
            error: e
        })
    }
}

/**
 * Borrar inventario
 */
 const deleteInventarioId = async (req = request, res = response) => {
    try{
        const id = req.params.id;
        const inv = await Inventario.findByIdAndDelete(id);
        res.status(204).json(inv);
    }catch(e){
        return res.status(500).json({
            error: e
        });
    }
}

/**
 * crea un inventario
 */
 const createInventario = async (req = request, res = response) => {
     try{
        const { serial, modelo, usuario, marca, estado, tipoEquipo } = req.body;
       // const {...data}= 
       // check serial y modelo no se repitan
        const serialBD = await Inventario.findOne({
            "serial":serial    
        });
        if(serialBD){
            return res.status(400).json({
                msj: 'Ya existe serial!'
            })
        }
        /*
        const modeloBD = await Inventario.findOne({
            "modelo":modelo    
        });
        if(modeloBD){
            return res.status(400).json({
                msj: 'Ya existe el modelo!'
            })
        }
        */
        const usuarioBD = await Usuario.findOne({
            _id: usuario, estado: true
        })
        if(!usuarioBD){
            return res.status(400).json({
                msj: 'No existe usuario!'
            })
        }
        // check marca exista y este activa
        const queryMarca ={"_id": marca, "estado": true}
        const marcaBD = await marcaModel.findOne(queryMarca);
        if(!marcaBD){
            return res.status(400).json({
                msj: 'No existe la marca!'
            })
        }
         // check estado existe y este activo
         const queryEstado ={"_id": estado, "estado": true}
         const estadoBD = await estadoModel.findOne(queryEstado);

         if(!estadoBD){
             return res.status(400).json({
                 msj: 'No existe el estado!'
             })
         }
        // check tipo equipo existe y este activo
        const queryTipo ={"_id": tipoEquipo, "estado": true}
        
        const tipoBD = await tipoEquipoModel.findOne(queryTipo);
        if(!tipoBD){
            return res.status(400).json({
                msj: 'No existe el tipo de equipo!'
            })
        } 

        const data = req.body;
        data.usuario=usuarioBD._id
        data.marca= marcaBD._id
        data.estado=estadoBD._id 
        data.tipoEquipo=tipoBD._id   
        const inventario = new Inventario(data);
        await inventario.save();
        res.status(201).json(inventario);
     }catch(e){
        return res.status(500).json({
            error: e
        });
    }
}


const updateInventario = async (req = request, res = response) => {
    try{
        const id = req.params.id
        const { serial, modelo, descripcion, fechaCompra, color, precio, usuario, marca, estado, tipoEquipo } = req.body;
        
        const data = {
            serial: serial,
            modelo: modelo,
            descripcion: descripcion,
            fechaCompra: fechaCompra,
            color: color,
            precio: precio,
            usuario: usuario,
            marca: marca,
            estado: estado,
            tipoEquipo: tipoEquipo
        }
        const inventarioBD = await Inventario.findOne({ _id: id});

       if(!inventarioBD){
        return res.status(400).json({
            msj: 'No existe este inventario'
        });
       } 
        const inventario = await Inventario.findByIdAndUpdate(id, data, {new : true});
        res.status(201).json(inventario);
    }catch(e){
        return res.status(500).json({
            error: e
        });
    }
}

const uploadImage = async (req = request, res = response) => {
    const { id } = req.params;
    console.log(req.files)
    const invBD = await Inventario.findOne({ _id: id});
    if(!invBD){
        return res.status(400).json({
            msj: 'No existe en inventario'
        });
    }
    if(!req.files || Object.keys(req.files) == 0 || !req.files.foto){
        return res.status(400).json({
            msj: 'No se está subiendo una foto'
        });
    }
    const foto = req.files.foto;
    console.log(foto)
    // validamos extensiones
    const extensionesAceptadas = ['jpg', 'jpeg', 'png', 'gif'];
    const arrayExtension = foto.name.split('.');
    const extension = arrayExtension[arrayExtension.length - 1];
    if(!extensionesAceptadas.includes(extension)){
        return res.status(400).json({
            msj: 'Extension no aceptada'
        });
    }
    const nombreTemp = `${uuidv4()}.${extension}`;
    const rutaSubida = path.join(__dirname, '../uploads', nombreTemp);
    //uploads/dadasdasdada.jpg
    foto.mv(rutaSubida, e => {
        if(e){
            return res.status(500).json({ error: e});
        }
    });
    const data = {};
    data.foto = nombreTemp;
    console.log("foto"+data.foto)
    const inv = await Inventario.findByIdAndUpdate(id, data, {new : true});
    if(!inv){
        return res.status(400).json({ error: 'Error al actualizar'});
    }
    res.status(201).json({msj: 'Se subió la foto'});
}

/**
 * Consultar foto
 */
 const getFoto = async (req = request, res = response) => {
    try{
        const { id } = req.params;
        const inventarioBD = await Inventario.findOne({ _id: id });
        if(!inventarioBD){
            return res.status(400).json({ error: 'No existe en inventario'});
        }
        const nombreFoto = inventarioBD.foto;
        const rutaImg = path.join(__dirname, '../uploads', nombreFoto);
        if(nombreFoto==''){
            const rutaImg1 = path.join(__dirname, '../uploads', 'noPreview.jpg');
            res.sendFile(rutaImg1);
        }else{
            res.sendFile(rutaImg);
        }
        
    }catch(e){
        return res.status(500).json({
            error: e
        })
    }
}

module.exports = { getInventarios, getInventarioByID, createInventario, updateInventario, uploadImage, deleteInventarioId, getFoto};