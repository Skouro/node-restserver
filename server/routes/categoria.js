const express = require('express');
const app = express();
const {
    verificaToken,
    verificaAdmin_Role
} = require('../middlewares/autenticacion');

let Categoria = require('../models/categoria');


//mostrar todas las categorias
//populate muestra informacion de categorias indexadas
//sort orden
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        res.json({
            categorias: data
        });
    });
});

//Mostrar categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {
    const id = req.params['id'];
    console.log(id);
    Categoria.findById(id, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (!data) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no ha sido encontrado'
                }
            });
        }
        res.json({
            ok: true,
            categoria: data
        });
    });

});


//Crear una Categoria
app.post('/categoria', verificaToken, (req, res) => {
    const body = req.body;
    const newCategoria = new Categoria({
        descripcion: body['descripcion'],
        usuario: req.usuario._id
    });
    newCategoria.save((err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (!data) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        res.json({
            ok: true,
            categoria: data
        });
    });
});

//actualizar un categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    //actulizar descripcion
    let id = req.params.id;
    console.log(id);
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, {
        new: true,
        runValidators: true
    }, (err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        if (!data) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        res.json({
            ok: true,
            categoria: data
        });
    });
});

//borrar un  categoria 
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo un administrador
    id: req.params['id'];
    Categoria.findByIdAndRemove(id, (err, data) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }
        if (!data) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        res.json({
            ok:true,
            message: 'Categoria Borrada',
            categoria: data
        });

    });
});

module.exports = app;