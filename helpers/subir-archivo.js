const path = require('path');
const {v4: uuidv4} = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'jfif'], carpeta = '') => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length - 1];

        //validar la extension
        if (!extensionesValidas.includes(extension)) {
            return reject(`Extension ${extension} no valida, extensiones validas: ${extensionesValidas}`);
            // return res.status(400).json({
            //     msg: `extensiones validas: ${extensionesValidas}`
            // });
        }

        const nombretemp = uuidv4() + '.' + extension;

        const uploadPAth = path.join(__dirname, '../uploads/',carpeta, nombretemp);

        archivo.mv(uploadPAth, (err) => {
            if (err) {
                return reject(err);
                // return res.status(500).json({ msg: err });
            }
            return resolve(nombretemp);
            res.json({ msg: 'File uploaded to ' + uploadPAth });
        });
    });
}

module.exports = {
    subirArchivo
}