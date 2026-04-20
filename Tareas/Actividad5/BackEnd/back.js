/*
 * BackEnd: conecta DB y API
 *
 * Daniel José Armas Azar A01786896
 * Guillermo Patricio González Martínez A01787393
 * David Blanco Ortiz A01786713
 */

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const host = '192.168.1.8';
const user = 'root';
const pass = 'bl200611';
const db = 'Cat_Cafe4';

app.use(cors());

//Lectura de menú por día
app.get('/menu/:day', (req, res) => {
    const day = req.params.day;

    const connection = mysql.createConnection({
        host: host,
        user: user,
        password: pass,
        database: db
    });

    connection.connect((err) => {
        if (err) throw err;

        //Consulta menú con un proceso almacenado en DB
        connection.query(
            'CALL obtain_menu(?)', [day], (err, results) => {
                if (err) throw err;
                connection.end();
                res.json(results);
            }
        );
    });
});

//Lectura de gatos
app.get('/cats', (req, res) => {;

    const connection = mysql.createConnection({
        host: host,
        user: user,
        password: pass,
        database: db
    });

    connection.connect((err) => {
        if (err) throw err;

        //Consulta la información de los gatos almacenada en una vista
        connection.query(
            'SELECT * FROM cats', (err, results) => {
                if (err) throw err;
                connection.end();
                res.json(results);
            }
        );
    });
});

app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});