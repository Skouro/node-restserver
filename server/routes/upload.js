const fs = require('fs');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

//hace que los archivos queden en req.files
app.use(fileUpload({
    useTempFiles: true
}));

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params['tipo'];
    let id = req.params['id'];

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No files were uploaded'
            }
        });
    }

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son' + tiposValidos.join(', '),
                ext: tipo
            }
        });
    }
    let archivo = req.files.archivo;
    //Validar la extencion de un equipo
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[1];
    let extencionValidas = ['jpg', 'png', 'gif', 'jpeg'];

    if (extencionValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extencionValidas.join(', '),
                ext: extension
            }
        });
    }

    //Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        switch (tipo) {
            case   'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;
            case   'productos':
                imagenProducto(id, res, nombreArchivo);
                break;

        }


    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }
        //verificar si ya existe imagen en el servidor y borrar
        borrarArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDb) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDb) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El Producto no existe'
                }
            });
        }
        //verificar si ya existe imagen en el servidor y borrar
        borrarArchivo(productoDb.img, 'productos');
        productoDb.img = nombreArchivo;
        productoDb.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });
    });
}

function borrarArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;