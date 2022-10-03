import connection from "../db/pgsql.js";
import customerSchema from "../schemas/customers.Schema.js";

async function customersMiddlewares(req, res, next) {
  const body = req.body;
  const isValid = customerSchema.validate(body, { abortEarly: false });

  if (isValid.error) {
    return res
      .status(400)
      .send(isValid.error.details.map((erro) => erro.message));
  }

  try {
    const CPF = await connection.query(
      "SELECT * FROM customers WHERE cpf = $1;",
      [body.cpf]
    );

    if (CPF.rowCount > 0) {
      return res.sendStatus(409);
    }

    next();
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
}

async function updateCustomersMiddlewares(req, res, next) {
  const { id } = req.params;
  const body = req.body;
  const isValid = customerSchema.validate(body, { abortEarly: false });

  if (isValid.error) {
    return res
      .status(400)
      .send(isValid.error.details.map((erro) => erro.message));
  }

  try {
    const { rows, rowCount } = await connection.query(
      "SELECT * FROM customers WHERE cpf = $1 AND id = $2;",
      [body.cpf, id]
    );

    if (rowCount < 1) {
      return res.status(404).send("Usuário não encontrar");
    }

    next();
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
}

export { customersMiddlewares, updateCustomersMiddlewares };
