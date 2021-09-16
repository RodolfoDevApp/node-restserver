const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarjwt } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");


const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try {
        //verificar si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        //si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos -estado: false'
            });
        }
        //verificar la contraseña
        const validPassword = await bcryptjs.compare(password, usuario.password);
        console.log(validPassword);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos -estado: password'
            });
        }
        // generar el jwt
        const token = await generarjwt(usuario.id);


        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error comuniquese con soporte'
        });
    }

}

const googleSignin = async(req, res = response) =>{
    
    const {id_token} = req.body;
    
    try {
    // const googleUser = await googleVerify(id_token);
    const {correo, nombre, img} = await googleVerify(id_token);
    
    let usuario = await Usuario.findOne({correo});

    if (!usuario) {
        const data = {
            nombre,
            correo,
            password: '1',
            img,
            google:true
        };
        usuario = new Usuario(data);
        await usuario.save();        
    }

    //si el usuario en db
    if (!usuario.estado) {
        return res.status(401).json({
            msg: 'Hable con el administrador'
        });
    }

    //generar el jwt
    const token = await generarjwt(usuario.id);

    // console.log('Este es el googleuser',googleUser);
    
        
        res.json({
            usuario,
            token
        });

    } catch (error) {

        res.status(400).json({
            msg:'Token de google no es válido'
        });

    }
}

module.exports = {
    login,
    googleSignin
}