/*
 * BackEnd: to connect interconnect DB and API
 *
 * Daniel José Armas Azar A01786896
 * Guillermo Patricio González Martínez A01787393
 * David Blanco Ortiz A01786713
 */

//Definition of modules
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: '192.168.1.10',
    user: 'root',
    password: 'bl200611',
    database: 'hyperjump'
}).promise();

//Generation zones backend
app.get('/stats/top', async (req, res) => {
    try{
    
    const [top_players] = await pool.query('SELECT * FROM top_players');

    res.json(top_players);
    }catch(error){
        console.error('Error fetching top_players:', error);
        res.status(500).json({ error: 'Error fetching generation zones' });
    }
});


app.listen(port, () => {
    console.log(`Servidor en http://localhost:${port}`);
});