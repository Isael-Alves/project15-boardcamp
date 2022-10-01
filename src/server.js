import express, { json }  from "express";
import cors from 'cors';
import dotenv from "dotenv";
import categories from "./routes/categories.Router.js";
dotenv.config();


const server = express();
server.use(json());
server.use(cors());



//categorias
server.use(categories);

//Jogos
server.get("/games", async (req, res) => {
  const games = await connection.query("SELECT * FROM games");

  res.send(games.rows);
});

server.post("/games", async (req, res) => {
  const { name } = req.body;

  console.log(name);
  res.sendStatus(201);
});

//Clientes
server.get("/customers", async (req, res) => {
  const customers = await connection.query("SELECT * FROM customers");

  res.send(customers.rows);
});

server.post("/customers", async (req, res) => {
  const { name } = req.body;

  console.log(name);
  res.sendStatus(201);
});

server.put("/customers/:id", async (req, res) => {
  const { id } = req.params;

  console.log(id);
  res.sendStatus(200);
});

//Aluguéis
server.get("/rentals", async (req, res) => {
  const rentals = await connection.query("SELECT * FROM rentals");

  res.send(rentals.rows);
});

server.post("/rentals", async (req, res) => {
  const { name } = req.body;

  console.log(name);
  res.sendStatus(201);
});

server.post("/rentals/:id/return", async (req, res) => {
  const { id } = req.params;

  console.log(id);
  res.sendStatus(200);
});

server.delete("/rentals/:id", async (req, res) => {
  const { id } = req.params;

  console.log(id);
  res.sendStatus(200);
});

server.listen(process.env.PORT, () => {
  console.log("Server running oh port " + process.env.PORT);
});
