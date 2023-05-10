const { response } = require("express")

const esAdminRol = (req, res = response, next) => {

    const usuario = req.usuario;

    if (!usuario) {
        return res.status(500).json({
            msg: 'Se quiere validar el role sin validar el token'
        });
    }

    if (usuario.rol != 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${usuario.nombre} no es administrador - No puede hacer eso`
        });
    }

    next();
}

const tieneRole = (...roles) => {
    return (req, res = response, next) => {

        console.log(req.usuario.rol);

        if (!roles.includes(req.usuario.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            });
        }

        next();
    };
}

module.exports = {
    esAdminRol,
    tieneRole
}