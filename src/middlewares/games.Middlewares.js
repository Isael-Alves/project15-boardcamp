import gamesSchema from "../schemas/games.Schema.js";
import connection from "../db/pgsql.js";

async function gamesPostMiddlewares(req, res, next) {
  const body = req.body;
  const { name } = body;
  const isValid = gamesSchema.validate(body, { abortEarly: false });

  if (isValid.error) {
    return res
      .status(400)
      .send(isValid.error.details.map((error) => error.message));
  }
  try {
    const nameGame = await connection.query(
      "SELECT games.name FROM games WHERE name = $1;",
      [name]
    );
    if (nameGame.rows.length > 0) {
      return res.status(409).send("Nome já existente.");
    }

    next();
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
}

export default gamesPostMiddlewares;
