const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
    // const query = req.query;
    // const { q, nombre = 'no name', apikey, page = 1, limit } = req.query;
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.countDocuments(query);

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios,
    }
        //     {
        //     msg: 'get API - controlador',
        //     q,
        //     nombre,
        //     apikey,
        //     page,
        //     limit
        // }
    );
}

const usuariosPut = async (req, res = response) => {
    const id = req.params.id;
    const { _id, password, google, correo, ...resto } = req.body;

    //validar contra db
    if (password) {
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json(usuario);
}

const usuariosPost = async (req, res = response) => {

    // const body = req.body;
    const { nombre, correo, password, rol } = req.body;
    // const {nombre, edad} = req.body;
    // const usuario = new Usuario(body);
    const usuario = new Usuario({ nombre, correo, password, rol });

    //encriptar contraseña
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);
    //guardado a mongo
    await usuario.save();

    res.json({
        // msg: 'post API - controlador',
        // nombre,
        // edad
        usuario
    });
}

const usuariosDelete = async(req, res = response) => {
    
    const {id} = req.params;

    //borrado fisico
    // const usuario = await Usuario.findByIdAndDelete(id);
    const usuario = await Usuario.findByIdAndUpdate(id,{estado: false});

    res.json( usuario);
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}