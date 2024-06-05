//server/config/db.js
require("dotenv").config();

if (process.env.NODE_ENV === "production") {
  require("dotenv").config({ path: ".env.production" });
}

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_URL,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  dateStrings: "date",
});

db.connect((err) => {
  if (!err) {
    console.log("Mysql DB 연결 성공");
  } else {
    console.error("Mysql DB 연결 실패: ", err);
  }
});

module.exports = db;
