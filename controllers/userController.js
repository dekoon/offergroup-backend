// controllers/userController.js
const db = require("../config/db");

// 고객 관리
exports.customerManager = (req, res) => {
  const page = Number.parseInt(req.query.page);
  const offset = Number.parseInt(req.query.offset);
  const startNum = (page - 1) * offset;
  const search = req.query.searchQuery || "";
  const idSearch = "%" + search + "%";
  const emailSearch = "%" + search + "%";
  const nameSearch = "%" + search + "%";

  let sql =
    "SELECT COUNT(idx) AS cnt FROM customer WHERE id LIKE ? OR name LIKE ?  OR email LIKE ?;";
  db.query(sql, [idSearch, nameSearch, emailSearch], (err, result) => {
    if (err) {
      throw err;
    } else {
      let userSQL =
        "SELECT * FROM customer WHERE id LIKE ? OR name LIKE ? OR email LIKE ? ORDER BY idx DESC LIMIT ?, ?;";
      db.query(
        userSQL,
        [idSearch, nameSearch, emailSearch, startNum, offset],
        (err, users) => {
          if (err) {
            throw err;
          } else {
            res.send({
              users,
              page,
              totalRows: result[0].cnt,
              totalPageNum: Math.ceil(result[0].cnt / offset),
            });
          }
        }
      );
    }
  });
};

// 판매자 관리
exports.sellerManager = (req, res) => {
  const page = Number.parseInt(req.query.page);
  const offset = Number.parseInt(req.query.offset);
  const startNum = (page - 1) * offset;
  const search = req.query.searchQuery || "";
  const idSearch = "%" + search + "%";
  const emailSearch = "%" + search + "%";
  const regdateSearch = "%" + search + "%";

  let sql =
    "SELECT COUNT(idx) AS cnt FROM user WHERE id LIKE ? OR email LIKE ? OR regdate LIKE ?;";
  db.query(sql, [idSearch, emailSearch, regdateSearch], (err, result) => {
    if (err) {
      throw err;
    } else {
      let userSQL =
        "SELECT * FROM user WHERE id LIKE ? OR email LIKE ? OR regdate LIKE ? ORDER BY idx DESC LIMIT ?, ?;";
      db.query(
        userSQL,
        [idSearch, emailSearch, regdateSearch, startNum, offset],
        (err, users) => {
          if (err) {
            throw err;
          } else {
            res.send({
              users,
              page,
              totalRows: result[0].cnt,
              totalPageNum: Math.ceil(result[0].cnt / offset),
            });
          }
        }
      );
    }
  });
};

// 고객 삭제
exports.deleteCustomer = (req, res) => {
  const { idx } = req.params;
  let sql = "DELETE FROM customer WHERE idx=?;";
  db.query(sql, [idx], (err) => {
    if (err) {
      throw err;
    } else {
      res.send({ status: 201, message: "회원 삭제 완료" });
    }
  });
};

// 판매자 삭제
exports.deleteSeller = (req, res) => {
  const { idx } = req.params;
  let sql = "DELETE FROM user WHERE idx=?;";
  db.query(sql, [idx], (err) => {
    if (err) {
      throw err;
    } else {
      res.send({ status: 201, message: "회원 삭제 완료" });
    }
  });
};
