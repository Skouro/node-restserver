const express = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const _ = require('underscore');

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

module.exports = app;
