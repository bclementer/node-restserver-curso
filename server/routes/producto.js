const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// ===========================
//  Obtener productos
// ===========================
app.get('/productos', verificaToken, (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado

    //1. Creamos los parámetros para paginar
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let hasta = req.query.hasta || 10;
    hasta = Number(hasta);

    //2. Recuperamos todos los productos.
    Producto.find()
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

// ===========================
//  Obtener un producto por ID
// ===========================
app.get('/productos/:id', (req, res) => {
    // populate: usuario categoria
    // paginado
    let id = req.params.id;

    //1. Creamos los parámetros para paginar
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let hasta = req.query.hasta || 10;
    hasta = Number(hasta);

    //2. Recuperamos todos los productos.
    Producto.findById(id)
        .skip(desde)
        .limit(hasta)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

// ===========================
//  Buscar productos
// ===========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});


// ===========================
//  Crear un nuevo producto
// ===========================
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 

    //1. Recuperamos el body.
    let body = req.body;

    //2. Creamos el producto.
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    //3. Almacenamos el producto.
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

// ===========================
//  Actualizar un producto
// ===========================
app.put('/productos/:id', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoria del listado 

    //Recuperamos el id y los datos del producto a actualizar
    let id = req.params.id;
    let body = req.body;

    /* OPCIÓN 1 */
    //1. Buscar ese producto en la base de datos.
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe producto con el id indicado.'
                }
            });
        }

        //Recuperamos los datos.
        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;

        //2. Actualizamos el producto.
        productoDB.save((err, productoActualizado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            resp.status(201).json({
                ok: true,
                producto: productoActualizado
            });
        });
    });

    /*
        // OPCIÓN 2
        //1. Buscar ese producto en la base de datos y actualizarlo.
        let productoAct = {
            nombre: body.nombre,
            precioUni: body.precioUni,
            descripcion: body.descripcion,
            disponible: body.disponible
        }

        Producto.findByIdAndUpdate(id, productoAct, { new: true, runValidators: true }, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            resp.json({
                ok: true,
                producto: productoDB
            });
        });
    */
});

// ===========================
//  Borrar un producto
// ===========================
app.delete('/productos/:id', verificaToken, (req, res) => {
    //Recuperamos el id y los datos del producto a actualizar
    let id = req.params.id;

    /* OPCIÓN 1 */
    //1. Buscar ese producto en la base de datos.
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe producto con el id indicado.'
                }
            });
        }

        //Actualizamos el campo disponible
        productoDB.disponible = false;

        //2. Actualizamos el producto.
        productoDB.save((err, productoBorrado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            resp.json({
                ok: true,
                producto: 'Producto borrado correctamente.'
            });
        });
    });

    /*
        // OPCIÓN 2
        //1. Buscar ese producto en la base de datos y actualizarlo.
        let productoBorra = {
            disponible: false
        }

        Producto.findByIdAndUpdate(id, productoBorra, (err, productoEliminado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (productoEliminado.disponible === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            resp.json({
                ok: true,
                producto: 'Producto borrado correctamente.'
            });
        }); 
    */
});

module.exports = app;