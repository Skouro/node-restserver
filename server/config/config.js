// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;


// ============================
//  Entorno
// ============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ============================
//  Vencimiento del Token
// ============================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = '48h';


// ============================
//  SEED de autenticación
// ============================
process.env.SEED = process.env.SEED || 'chucho-el-cachucho-desarrollo';

// ============================
//  Base de datos
// ============================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = "mongodb+srv://admin:1193120855@cluster0-xjwrt.mongodb.net/cafe?retryWrites=true";
}
process.env.URLDB = urlDB;

// ============================
//  Google client ID
// ============================
process.env.CLIENT_ID = process.env.CLIENT_ID  || '743716649436-qrmtlf8t5ekko5q74dsictop1rbfi801.apps.googleusercontent.com';