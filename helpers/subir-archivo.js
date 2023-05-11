
const path = require('path');

const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
    return new Promise((resolve, reject) => {
        const { archivo } = files;

        const nombreSpit = archivo.name.split('.');
        const extension = nombreSpit[nombreSpit.length - 1];

        // Validar extensión
        if (!extensionesValidas.includes(extension.toLowerCase())) {

            reject(`La  extensión: [${extension}] no es permitida, [${extensionesValidas}]`);
        }

        const nomTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nomTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(nomTemp);
        });
    });
}

module.exports = {
    subirArchivo
}