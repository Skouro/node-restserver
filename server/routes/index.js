//archivo de rutas para evitar que el archivo server se llene demasiado
const express = require('express');
const app = express();
app.use( require('./login'));
app.use( require('./usuario'));

module.exports = app;
