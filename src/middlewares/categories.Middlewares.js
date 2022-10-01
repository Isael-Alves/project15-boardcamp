import categoriesSchema from "../schemas/categories.Schema.js";
import connection from '../db/pgsql.js'

async function categoriesMiddlewares(req, res, next) {
  const { name } = req.body;
  const isValid = categoriesSchema.validate({ name });

  if (isValid.error) {
    return res.sendStatus(400);
  }

  try {
    const checkCategory = await connection.query(
      "SELECT * FROM categories WHERE name = $1;",
      [name]
    );

    if(checkCategory.rowCount > 0){
        return res.status(409).send("Categoria já existente.");
    };

    next();
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
}


export default categoriesMiddlewares;