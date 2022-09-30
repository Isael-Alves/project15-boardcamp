import express, { json } from "express";
import pkg from 'pg';
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const connection = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password:'postgres',
    database: 'boardcamp'
});

const server = express();
server.use(json());

server.get('games', (req, res)=> {
const games = connection.query('SELECT * FROM games');

res.send(games);

});

server.listen(process.env.PORT, () => {
  console.log("Server running oh port " + process.env.PORT);
});
