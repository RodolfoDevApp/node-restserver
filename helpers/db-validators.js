const Role = require('../models/role');
const { Error } = require('mongoose');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
        throw new Error(`El rol ${ rol } no esta registrado en la BD`)
    }
}

const emailExiste = async(correo = '')=> {
    const existe = await Usuario.findOne({correo});
        if (existe) {
            throw new Error(`El correo ${ correo }, ya esta registrado`);
        }
}

const existeUsuarioPorId = async(id)=> {
    const existe = await Usuario.findById(id);
        if (!existe) {
            throw new Error(`El id ${ id }, no existe`);
        }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}