import rentalsSchema from "../schemas/rental.Schema.js";
import connection from "../db/pgsql.js";

async function validationRentals(req, res, next) {
  const rental = req.body;
  const { gameId, customerId } = rental;
  const validation = rentalsSchema.validate(rental);

  if (validation.error) {
    return res.sendStatus(400);
  }

  const resCustomers = await connection.query(
    "SELECT id FROM customers WHERE id = $1",
    [customerId]
  );
  if (resCustomers.rowCount === 0) {
    return res.sendStatus(400);
  }

  const resGame = await connection.query("SELECT * FROM games WHERE id=$1", [
    gameId,
  ]);
  if (resGame.rowCount < 1) {
    return res.sendStatus(400);
  }
  const game = resGame.rows[0];

  const result = await connection.query(
    `SELECT id FROM rentals WHERE "gameId" = $1 AND "returnDate" IS null`,
    [gameId]
  );

  if (result.rowCount > 0) {
    if (game.stockTotal === result.rowCount) {
      return res.sendStatus(400);
    }
  }

  next();
}

export default validationRentals;
