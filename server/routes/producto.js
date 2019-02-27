const express = require('express');

const {
    verificaToken
} = require('../middlewares/autenticacion');

const app = express();

let Producto = require('../models/producto');

//Obtener todos los productos
app.get('/productos', (req, res) => {
    //ppopulate: usuario, categoria
    //paginado
    let desde = Number.parseInt(req.query.desde) || 0;
    console.log(req.query);
    Producto.find({
            disponible: true
        })
        .skip(desde)
        .limit(10)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, data) => {
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
                productos: data
            });
        });
});

//Obtener un producto por Id
app.get('/productos/:id', (req, res) => {
    //ppopulate: usuario, categoria
    let id = req.params['id'];
    Producto.findById(id, (err, data) => {
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
                producto: data
            });
        })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion');
});


//Busacar productos
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params['termino'];
    let regex = new RegExp(termino, 'i');
    Producto.find({
            nombre: regex
        })
        .populate('categoria', 'descripcion')
        .exec((err, data) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }
            res.json({
                ok: true,
                productos: data
            });
        })
        ;
        
});

//Agregar un producto
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let newProducto = new Producto({
        nombre: body['nombre'],
        precioUni: body['precio'],
        descripcion: body['descripcion'],
        disponible: body['disponible'],
        categoria: body['categoria'],
        usuario: req.usuario._id
    });

    newProducto.save((err, data) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }
        res.status(201).json({
            ok: true,
            producto: data
        });
    });
    //grabar ususario
    //grabar categoria del listado
});

//Actualizar un producto
app.put('/productos/:id', (req, res) => {
    //grabar ususario
    //grabar categoria del listado
    let body = req.body;
    let producto = {
        precio: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        nombre: body.nombre
    };

    let id = req.params['id'];
    Producto.findByIdAndUpdate(id, producto, (err, data) => {
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
            producto: data
        });
    });

});

//Borrar un producto
app.delete('/productos/:id', (req, res) => {
    //cambiar propiedad disponible
    let id = req.params.id;
    let producto = {
        disponible: req.body['disponible']
    }

    Producto.findByIdAndUpdate(id, producto, {
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
            producto: data
        });
    });

});



module.exports = app;