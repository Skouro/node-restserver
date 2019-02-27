const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const _ = require('underscore');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

const app = express();

app.post('/login',(req, res) => {
    let  body = req.body;
    //Encontrar un usuario
    Usuario.findOne({email: body['email']} ,(err,usuariDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (! usuariDB){
            return res.status(400).json({
                ok: false,
                err : {
                    message : '(Usuario) o contraseña incorrectos'
                }
            });
        }
       if ( ! bcrypt.compareSync(body['password'], usuariDB.password)){
           return res.status(400).json({
               ok: false,
               err : {
                   message : 'Usuario o (contraseña) incorrectos'
               }
           });
       }
       //Generacion del token que expira en un mes
        let token = jwt.sign({usuario: usuariDB},
            process.env.SEED ,{expiresIn: process.env.CADUCIDAD_TOKEN });
       res.json({
           ok: true,
           usuario : usuariDB,
           token
       });
    });
});


//Configuracion Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


//Recivir peritcion para verificar validez de token google
app.post('/google',(req, res) => 
{
    let token=  req.body['idtoken'];
    console.log(token);
    verify('token');
    res.json({
        token
    });

});

module.exports = app;
