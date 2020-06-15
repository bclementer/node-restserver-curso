require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//app.use(require('./routes/usuario'));

//Configuración global de rutas.
app.use(require('./routes/index'));

// Habilitar la carpeta public para acceder desde cualquier lugar.
app.use(express.static(path.resolve(__dirname, '../public')));

// parse application/json
app.use(bodyParser.json());

//Conexión a la base de datos.
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, res) => {
    if (err) {
        throw err;
    }

    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});