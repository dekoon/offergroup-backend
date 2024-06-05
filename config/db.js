require("dotenv").config();

if (process.env.NODE_ENV === "production") {
  require("dotenv").config({ path: ".env.production" });
}

const mysql = require("mysql2");

// 연결 풀 설정
const pool = mysql.createPool({
  host: process.env.DB_URL,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 10000,
  connectTimeout: 10000,
  dateStrings: "date", // 날짜 문자열 설정
});

// 데이터베이스 연결 확인
pool.getConnection((err, connection) => {
  if (!err) {
    console.log("Mysql DB 연결 성공");
    connection.release(); // 연결 반납
  } else {
    console.error("Mysql DB 연결 실패: ", err);
  }
});

// 연결 유지 쿼리 실행
const keepAliveQuery = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.query("SELECT 1");
    connection.release();
  } catch (error) {
    console.error("Error keeping the connection alive:", error);
  }
};

setInterval(keepAliveQuery, 60000); // 1분마다 연결 유지 쿼리 실행

module.exports = pool; // 모듈 내보내기 변경
