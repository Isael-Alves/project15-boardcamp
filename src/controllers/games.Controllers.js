import connection from "../db/pgsql.js";

async function getGames(req, res) {
  const { name } = req.query;

  try {
    const select =
      'SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON categories.id=games."categoryId"';
    const paramsSearch = [];
    let whereClause = "";

    if (name) {
      paramsSearch.push(`${name}%`);
      whereClause += `WHERE games.name ILIKE $${paramsSearch.length}`;

      const result = await connection.query(
        ` ${select} ${whereClause}`,
        paramsSearch
      );

      return res.status(200).send(result.rows);
    }

    const allGames = await connection.query(`${select};`);

    return res.status(200).send(allGames.rows);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

async function postGames(req, res) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  try {
    await connection.query(
      'INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ($1, $2, $3, $4, $5)',
      [name, image, Number(stockTotal), Number(categoryId), Number(pricePerDay)]
    );

    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export { getGames, postGames };
