//controllers/termsasController.js

const db = require("../config/db");

exports.list = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const offset = parseInt(req.query.offset) || 10;
  const startNum = (page - 1) * offset;

  let whereClause = "";
  const searchQuery = req.query.searchQuery;
  const select = req.query.select;

  if (searchQuery) {
    if (select === "title" || select === "content") {
      whereClause = `WHERE ${select} LIKE '%${searchQuery}%'`;
    } else if (select === "" || select === "all") {
      // "전체" 옵션이 선택되었을 경우
      whereClause = `WHERE title LIKE '%${searchQuery}%' OR content LIKE '%${searchQuery}%'`;
    }
  }

  let sql = `SELECT count(idx) AS cnt FROM terms_as ${whereClause};`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
      return;
    }
    let listSQL = `SELECT * FROM terms_as ${whereClause} ORDER BY idx DESC LIMIT ?, ?;`;
    db.query(listSQL, [startNum, offset], (err, termsass) => {
      if (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
        return;
      }
      res.send({
        termsass,
        page,
        totalRows: result[0].cnt,
        totalPageNum: Math.ceil(result[0].cnt / offset),
      });
    });
  });
};

exports.create = (req, res) => {
  const { type, title, content } = req.body;

  // 에러 로그 추가
  console.log("Received data:", req.body);

  // 데이터 유효성 검사
  if (!type || !title || !content) {
    return res.status(400).send({ error: "All fields are required" });
  }

  db.query(
    "INSERT INTO terms_as (type, title, content, regdate) VALUES (?, ?, ?, NOW())",
    [type, title, content],
    (err) => {
      if (err) {
        console.error("Database error:", err); // 에러 로그 추가
        return res.status(500).send({ error: err });
      }
      res.status(201).send({ message: "terms_as created successfully" });
    }
  );
};

exports.read = (req, res) => {
  const { idx } = req.params;

  db.query("SELECT * FROM terms_as WHERE idx = ?", [idx], (err, results) => {
    if (err || results.length === 0)
      return res.status(404).send({ error: "terms_as not found" });
    res.send(results[0]);
  });
};

exports.update = (req, res) => {
  const { idx } = req.params;
  const { type, title, content } = req.body;

  db.query(
    "UPDATE terms_as SET type = ?, title = ?, content = ?, regdate = NOW() WHERE idx = ?",
    [type, title, content, idx],
    (err) => {
      if (err) return res.status(500).send({ error: err });
      res.send({ message: "terms_as updated successfully" });
    }
  );
};

exports.delete = (req, res) => {
  const { idx } = req.params;

  db.query("DELETE FROM terms_as WHERE idx = ?", [idx], (err) => {
    if (err) return res.status(500).send({ error: err });
    res.send({ message: "terms_as deleted successfully" });
  });
};
