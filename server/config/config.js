// =========================
// Puerto
// =========================
process.env.PORT = process.env.PORT || 3000;

// =========================
// Entorno
// =========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =========================
// Vencimiento del Token
// =========================
// 60 minutos
// 60 segundos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// =========================
// SEED de autenticación
// =========================
process.env.SEDD = process.env.SEDD || 'este-es-el-seed-de-desarrollo';

// =========================
// Base de datos
// =========================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// =========================
// Google Client ID
// =========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '562422994297-ldfdvlem04fhmass8n9klq4qdj9a9egt.apps.googleusercontent.com';