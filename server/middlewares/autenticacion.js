//Ejecutar verificacion de TOKEN
const  jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
    //Obtenemos el token
    let token = req.query['token'];
    //verifiacmos si el token es correcto pasandole la semilla para decodificarlo
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }
//Si no hay un error permitimos que la funcion pueda continuar
        //el decode extrae la informacion del token
        req.usuario = decoded.usuario;
        next();

    });
};

//Verifica admin rolo

let verificaAdmin_Role = (req, res, next) => {

    if (  req.usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Rol no valido'
            }
        });
    }
    next();
};

module.exports = {
    verificaToken,
    verificaAdmin_Role
};
