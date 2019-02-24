//Puerto
process.env.PORT = process.env.PORT || 3000;

//Entorno
process.env.Node_ENV  = process.env.Node_ENV  || 'dev';


//Vencimiento del token
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDA_TOKEN =  60*60*24*30;
//Semilla del token
process.env.SEED = process.env.SEED  || 'chucho-el-cachucho-desarrollo';

//Base de datos
let urlDB;

if (process.env.Node_ENV  === 'dev') {
    urlDB = 'mongodb://localhost/cafe'; //Si estamos en un entorno local
} else  {
    urlDB  =  process.env.MONGO_URL; //Si se encuentra en producción
}
process.env.URLDB = urlDB;
