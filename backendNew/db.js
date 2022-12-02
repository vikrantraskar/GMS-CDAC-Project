const mysql = require("mysql");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "gymdb",
  port: 3306,
  connectionLimit: 20,
});

module.exports = {
  pool,
};
