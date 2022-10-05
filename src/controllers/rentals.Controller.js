import connection from "../db/pgsql.js";

async function getRentals(req, res) {
  const { customerId, gameId } = req.query;

  try {
    const params = [];
    const conditions = [];
    let textSelect = "";

    if (customerId) {
      params.push(customerId);
      conditions.push(`rentals."customerId" = $${params.length}`);
    }

    if (gameId) {
      params.push(gameId);
      conditions.push(`rentals."gameId"=$${params.length}`);
    }

    if (params.length > 0) {
      textSelect += `WHERE ${conditions.join(" AND ")}`;
    }

    const result = await connection.query(
      {
        text: `
          SELECT 
            rentals.*,
            customers.name,
            games.name,
            categories.*
          FROM rentals
            JOIN customers ON customers.id=rentals."customerId"
            JOIN games ON games.id=rentals."gameId"
            JOIN categories ON categories.id=games."categoryId"
          ${textSelect}
        `,
        rowMode: "array",
      },
      params
    );

    const {
      id,
      rentDate,
      daysRented,
      returnDate,
      originalPrice,
      delayFee,
      customerName,
      gameName,
      categoryId,
      categoryName,
    } = result.rows[0];

    return res.send({
      id,
      customerId,
      gameId,
      rentDate,
      daysRented,
      returnDate,
      originalPrice,
      delayFee,
      customer: {
        id: customerId,
        name: customerName,
      },
      game: {
        id: gameId,
        name: gameName,
        categoryId,
        categoryName,
      },
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function createRentals(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  try {
    const resGame = await connection.query("SELECT * FROM games WHERE id=$1", [
      gameId,
    ]);
    const { pricePerDay } = resGame.rows[0];

    const originalPrice = daysRented * pricePerDay;
    await connection.query(
      `INSERT INTO 
          rentals (
            "customerId", "gameId", "rentDate", 
            "daysRented", "returnDate", "originalPrice", "delayFee" )
          VALUES ($1, $2, NOW(), $3, null, $4, null);`,
      [customerId, gameId, daysRented, originalPrice]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function finishRentals(req, res) {
  const { id } = req.params;
  try {
    const { rowCount, rows } = await connection.query(
      `SELECT * FROM rentals WHERE id = $1`,
      [id]
    );

    if (rowCount === 0) return res.sendStatus(404);

    const { rentDate, daysRented, originalPrice } = rows[0];
    const { returnDate } = rows[0];
    if (returnDate) return res.sendStatus(400);
    else {
      const diasDeDifenca = Math.floor(
        (new Date().getTime() - new Date(rentDate).getTime()) /
          (24 * 3600 * 1000)
      );

      let delayFee = 0;
      if (diasDeDifenca > daysRented) {
        const addDias = diasDeDifenca - daysRented;
        delayFee = addDias * originalPrice;
      }

      await connection.query(
        `UPDATE rentals SET "returnDate" = NOW(), "delayFee" = $1 WHERE id = $2`,
        [delayFee, id]
      );

      res.sendStatus(200);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

async function deleteRentals(req, res) {
  const { id } = req.params;
  try {
    const { rows, rowCount } = await connection.query(
      "SELECT * FROM rentals WHERE id = $1",
      [id]
    );

    if (rowCount > 0) {
      const aluguel = rows[0];
      if (!aluguel.returnDate) {
        res.sendStatus(400);
      } else {
        await connection.query("DELETE FROM rentals WHERE id = $1", [id]);
      }
    }

    res.sendStatus(404);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export { getRentals, createRentals, finishRentals, deleteRentals };
