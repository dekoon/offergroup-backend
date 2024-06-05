//controllers/noticeController.js

const db = require("../config/db");

exports.list = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const offset = parseInt(req.query.offset) || 10;
  const startNum = (page - 1) * offset;

  let whereClause = "";
  const searchQuery = req.query.searchQuery;
  const select = req.query.select;

  if (searchQuery) {
    if (select === "title" || select === "contents") {
      whereClause = `WHERE ${select} LIKE '%${searchQuery}%'`;
    } else if (select === "" || select === "all") {
      // "전체" 옵션이 선택되었을 경우
      whereClause = `WHERE title LIKE '%${searchQuery}%' OR contents LIKE '%${searchQuery}%'`;
    }
  }

  let sql = `SELECT count(idx) AS cnt FROM notice ${whereClause};`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
      return;
    }
    let listSQL = `SELECT * FROM notice ${whereClause} ORDER BY idx DESC LIMIT ?, ?;`;
    db.query(listSQL, [startNum, offset], (err, notices) => {
      if (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
        return;
      }
      res.send({
        notices,
        page,
        totalRows: result[0].cnt,
        totalPageNum: Math.ceil(result[0].cnt / offset),
      });
    });
  });
};

exports.create = (req, res) => {
  const { title, contents } = req.body;
  const filepath = req.file ? req.file.path : null;

  db.query(
    "INSERT INTO notice (title, contents, filepath, regdate) VALUES (?, ?, ?, NOW())",
    [title, contents, filepath],
    (err) => {
      if (err) return res.status(500).send({ error: err });
      res.status(201).send({ message: "Notice created successfully" });
    }
  );
};

exports.read = (req, res) => {
  const { idx } = req.params;

  db.query("SELECT * FROM notice WHERE idx = ?", [idx], (err, results) => {
    if (err || results.length === 0)
      return res.status(404).send({ error: "Notice not found" });
    res.send(results[0]);
  });
};

exports.update = (req, res) => {
  const { idx } = req.params;
  const { title, contents } = req.body;
  const filepath = req.file ? req.file.path : null;

  db.query(
    "UPDATE notice SET title = ?, contents = ?, filepath = ?, regdate = NOW() WHERE idx = ?",
    [title, contents, filepath, idx],
    (err) => {
      if (err) return res.status(500).send({ error: err });
      res.send({ message: "Notice updated successfully" });
    }
  );
};

exports.delete = (req, res) => {
  const { idx } = req.params;

  db.query("DELETE FROM notice WHERE idx = ?", [idx], (err) => {
    if (err) return res.status(500).send({ error: err });
    res.send({ message: "Notice deleted successfully" });
  });
};
