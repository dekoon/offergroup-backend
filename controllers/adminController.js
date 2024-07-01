//controllers/adminController.js

const db = require("../config/db");

exports.list = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const offset = parseInt(req.query.offset) || 10;
  const startNum = (page - 1) * offset;

  let whereClause = "";
  const searchQuery = req.query.searchQuery;
  const select = req.query.select;

  if (searchQuery) {
    if (select === "id" || select === "adminname") {
      whereClause = `WHERE ${select} LIKE '%${searchQuery}%'`;
    } else if (select === "" || select === "all") {
      // "전체" 옵션이 선택되었을 경우
      whereClause = `WHERE id LIKE '%${searchQuery}%' OR adminname LIKE '%${searchQuery}%'`;
    }
  }

  let sql = `SELECT count(idx) AS cnt FROM admin ${whereClause};`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
      return;
    }
    let listSQL = `SELECT * FROM admin ${whereClause} ORDER BY idx DESC LIMIT ?, ?;`;
    db.query(listSQL, [startNum, offset], (err, admins) => {
      if (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
        return;
      }
      res.send({
        admins,
        page,
        totalRows: result[0].cnt,
        totalPageNum: Math.ceil(result[0].cnt / offset),
      });
    });
  });
};

exports.create = (req, res) => {
  const { id, pw, adminname, email, phone, auth } = req.body;

  db.query(
    "INSERT INTO admin (id, pw, adminname, email, phone, auth, regdate) VALUES (?, ?, ?, ?, ?, ?, NOW())",
    [id, pw, adminname, email, phone, auth], // `auth`를 포함하여 총 6개의 파라미터를 제공
    (err) => {
      if (err) return res.status(500).send({ error: err.message }); // err 객체에서 message 속성 사용
      res.status(201).send({ message: "Admin created successfully" }); // FAQ가 아닌 Admin 생성 메시지로 변경
    }
  );
};


exports.read = (req, res) => {
  const { idx } = req.params;

  db.query("SELECT * FROM admin WHERE idx = ?", [idx], (err, results) => {
    if (err || results.length === 0)
      return res.status(404).send({ error: "FAQ not found" });
    res.send(results[0]);
  });
};

exports.update = (req, res) => {
  const { idx } = req.params;
  const { id, pw, adminname, email, phone, auth } = req.body;

  db.query(
    "UPDATE admin SET id = ?, pw = ?, adminname = ?, email = ?, phone = ?, auth = ?, regdate = NOW() WHERE idx = ?",
    [id, pw, adminname, email, phone, auth, idx],
    (err) => {
      if (err) return res.status(500).send({ error: err });
      res.send({ message: "Admin updated successfully" });
    }
  );
};

exports.delete = (req, res) => {
  const { idx } = req.params;

  db.query("DELETE FROM admin WHERE idx = ?", [idx], (err) => {
    if (err) return res.status(500).send({ error: err });
    res.send({ message: "Admin deleted successfully" });
  });
};


//관리자로그인
// 관리자 로그인
exports.login = (req, res) => {
  const { id, pw } = req.body;
  const sql = "SELECT * FROM admin WHERE id = ? AND pw = ?";
  db.query(sql, [id, pw], (err, result) => {
    if (err) {
      res.status(500).send({ message: "Database error" });
      return;
    }
    if (result.length > 0) {
      // 로그인 성공
      res.send({
        success: true,
        message: "Login successful",
        userId: result[0].id,  // 사용자 ID 추가
        adminName: result[0].adminname  // 사용자 이름 추가
      });
    } else {
      res.status(401).send({ success: false, message: "Invalid credentials" });
    }
  });
};
