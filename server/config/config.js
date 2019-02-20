//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.Node_ENV  =process.env.Node_ENV  || 'dev';

//Base de datos
let urlDB;

if (process.env.Node_ENV  === 'dev') {
    urlDB = 'mongodb://localhost/cafe'; //Si estamos en un entorno local
} else  {
    urlDB  =  'mongodb://admin:1193120855@cluster0-shard-00-00-xjwrt.mongodb.net:27017,cluster0-shard-00-01-xjwrt.mongodb.net:27017,cluster0-shard-00-02-xjwrt.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'; //Si se encuentra en producción
}
process.env.URLDB = urlDB;
