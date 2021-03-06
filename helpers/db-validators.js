const Role = require('../models/role');
const { Error } = require('mongoose');
const {Usuario, Categoria, Producto} = require('../models');

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

const existeCategoriaPorId = async(id)=> {
    const existe = await Categoria.findById(id);
        if (!existe) {
            throw new Error(`El id ${ id }, no existe`);
        }
}
const existeProductoPorId = async(id)=> {
    const existe = await Producto.findById(id);
        if (!existe) {
            throw new Error(`El id ${ id }, no existe`);
        }
}

//validar coleeciones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion);
    if (!incluida) {
        throw new Error(`La colección ${coleccion} no es permitida, ${colecciones}`);
    }

    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}