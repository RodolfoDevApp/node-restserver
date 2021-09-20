const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');
const { subirArchivo } = require('../helpers');

const { Producto, Usuario } = require('../models')

const cargarArchivos = async (req, res = response) => {

    // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    //     res.status(400).json({msg:'No files were uploaded.'});
    //     return;
    // }

    try {
        // ejemplo de envio
        //const nombre = await subirArchivo(req.files, undefined, 'imgs');
        const nombre = await subirArchivo(req.files);

        res.json({ nombre });

    } catch (error) {
        res.status(400).json({ error });
    }


}

const actualizarImagenCloudinary = async (req, res = response) => {

    // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    //     res.status(400).json({msg:'No files were uploaded.'});
    //     return;
    // }

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {

        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: 'porfavor contacte a soporte'
            });
    }
    //limpiar imagenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length -1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const {tempFilePath} = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    
    modelo.img = secure_url;

    await modelo.save();
    return res.json({ modelo })
}

const actualizarImagen = async (req, res = response) => {

    // if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    //     res.status(400).json({msg:'No files were uploaded.'});
    //     return;
    // }

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {

        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: 'porfavor contacte a soporte'
            });
    }
    //limpiar imagenes previas
    if (modelo.img) {
        const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImg)) {
            fs.unlinkSync(pathImg);
        }
    }

    const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;

    await modelo.save();
    res.json({ modelo })
}

const mostrarImg = async (req, res) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {

        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;

        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({
                msg: 'porfavor contacte a soporte'
            });
    }
    //limpiar imagenes previas
    if (modelo.img) {
        // const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
        // if (fs.existsSync(pathImg)) {
        //     return res.sendFile(pathImg);
        // }
        return res.json({
            img: modelo.img
        });
    }
    const pathImg = path.join(__dirname, '../assets', 'no-image.jpg');
    return res.sendFile(pathImg);
}


module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImg,
    actualizarImagenCloudinary
}