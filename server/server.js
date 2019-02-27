require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
//arreglar el path de acceso public
const path = require('path');
const app = express();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Importar el archivo que contiene todas  las rutas
app.use( require('./routes/index'));

//Habilitar la carpeta public
//con el path.resolve reconstruimos un path valido
app.use(express.static(path.resolve( __dirname , '../public')));

mongoose.connect(process.env.URLDB,(err,res) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT , () => {
    console.log('Escuchado puerto: ',process.env.PORT);
});
