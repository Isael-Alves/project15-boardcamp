import express, { json }  from "express";
import cors from 'cors';
import dotenv from "dotenv";
import categories from "./routes/categories.Router.js";
import games from "./routes/games.Router.js";
import customers from "./routes/customers.Router.js";
import rentals from "./routes/rentals.Router.js";
dotenv.config();


const server = express();
server.use(json());
server.use(cors());

//categorias
server.use(categories);

//Jogos
server.use(games);

//Clientes
server.use(customers);

//Aluguéis
server.use(rentals);

server.listen(process.env.PORT, () => {
  console.log("Server running oh port " + process.env.PORT);
});
