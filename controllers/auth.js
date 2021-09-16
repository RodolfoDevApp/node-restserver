const { response } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarjwt } = require("../helpers/generar-jwt");


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

module.exports = {
    login
}