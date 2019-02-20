//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.Node_ENV  = process.env.Node_ENV  || 'dev';

//Base de datos
let urlDB;

// if (process.env.Node_ENV  === 'dev') {
//     urlDB = 'mongodb://localhost/cafe'; //Si estamos en un entorno local
// } else  {
    urlDB  =  process.env.MONGO_URL; //Si se encuentra en producción
// // }
process.env.URLDB = urlDB;
