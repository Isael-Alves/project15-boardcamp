import connection from "../db/pgsql.js";

async function getCustomers(req, res) {
  const { cpf } = req.query;
  try {
    const select = "SELECT * FROM customers";
    const paramsSearch = [];
    let whereClause = "";

    if (cpf) {
      paramsSearch.push(`${cpf}%`);
      whereClause += `WHERE cpf LIKE $${paramsSearch.length}`;

      const cpfs = await connection.query(
        ` ${select} ${whereClause}`,
        paramsSearch
      );

      return res.status(200).send(cpfs.rows);
    }

    const { rows } = await connection.query(`${select};`);

    return res.status(200).send(rows);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

async function getCustomersId(req, res) {
  const { id } = req.params;
  try {
    const select = "SELECT * FROM customers WHERE id = $1";

    if (id) {
      const { rows, rowCount } = await connection.query(`${select}`, [id]);

      if (rowCount > 0) {
        return res.status(200).send(rows);
      }

      return res.status(404).send("Usuário não existe");
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

async function postCustomers(req, res) {
  const { name, phone, cpf, birthday } = req.body;
  try {
    await connection.query(
      "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4)",
      [name, phone, cpf, birthday]
    );

    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

async function putCustomers(req, res) {
  const { id } = req.params;
  const { name, phone, cpf, birthday } = req.body;

  try {
    const { rowCount } = await connection.query(
      "SELECT * FROM customers WHERE cpf = $1 AND id = $2",
      [cpf, id]
    );

    if (rowCount < 0) {
      return res.sendStatus(409);
    }

    await connection.query(
      `UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`,
      [name, phone, cpf, birthday, id]
    );

    res.status(200).send("User updated");
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export { getCustomers, postCustomers, putCustomers, getCustomersId };
