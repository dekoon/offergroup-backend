//controllers/faqController.js

const db = require("../config/db");

exports.list = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const offset = parseInt(req.query.offset) || 10;
  const startNum = (page - 1) * offset;

  let whereClause = "";
  const searchQuery = req.query.searchQuery;
  const select = req.query.select;

  if (searchQuery) {
    if (select === "question" || select === "answer") {
      whereClause = `WHERE ${select} LIKE '%${searchQuery}%'`;
    } else if (select === "" || select === "all") {
      // "전체" 옵션이 선택되었을 경우
      whereClause = `WHERE question LIKE '%${searchQuery}%' OR answer LIKE '%${searchQuery}%'`;
    }
  }

  let sql = `SELECT count(idx) AS cnt FROM faq ${whereClause};`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
      return;
    }
    let listSQL = `SELECT * FROM faq ${whereClause} ORDER BY idx DESC LIMIT ?, ?;`;
    db.query(listSQL, [startNum, offset], (err, faqs) => {
      if (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
        return;
      }
      res.send({
        faqs,
        page,
        totalRows: result[0].cnt,
        totalPageNum: Math.ceil(result[0].cnt / offset),
      });
    });
  });
};

exports.create = (req, res) => {
  const { question, answer } = req.body;

  db.query(
    "INSERT INTO faq (question, answer, regdate) VALUES (?, ?, NOW())",
    [question, answer],
    (err) => {
      if (err) return res.status(500).send({ error: err });
      res.status(201).send({ message: "FAQ created successfully" });
    }
  );
};

exports.read = (req, res) => {
  const { idx } = req.params;

  db.query("SELECT * FROM faq WHERE idx = ?", [idx], (err, results) => {
    if (err || results.length === 0)
      return res.status(404).send({ error: "FAQ not found" });
    res.send(results[0]);
  });
};

exports.update = (req, res) => {
  const { idx } = req.params;
  const { question, answer } = req.body;

  db.query(
    "UPDATE faq SET question = ?, answer = ?, regdate = NOW() WHERE idx = ?",
    [question, answer, idx],
    (err) => {
      if (err) return res.status(500).send({ error: err });
      res.send({ message: "FAQ updated successfully" });
    }
  );
};

exports.delete = (req, res) => {
  const { idx } = req.params;

  db.query("DELETE FROM faq WHERE idx = ?", [idx], (err) => {
    if (err) return res.status(500).send({ error: err });
    res.send({ message: "FAQ deleted successfully" });
  });
};
