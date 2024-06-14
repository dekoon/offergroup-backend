//controllers/ordersController.js
const bcrypt = require("bcrypt");
const db = require("../config/db");
const saltRounds = 10;

// 주문목록보이기(관리자용)
exports.getOrders = (req, res) => {
    const page = parseInt(req.query.page) || 1; // 기본 페이지는 1
    const offset = parseInt(req.query.offset) || 10; // 페이지 당 목록 수, 기본값 10
    const searchQuery = req.query.searchQuery || ''; // 검색어, 기본값 빈 문자열
    const select = req.query.select; // 검색 타입(예: userId, customerName)

    let searchSQL = '';
    if (searchQuery && select) {
        searchSQL = `AND ${select} LIKE '%${searchQuery}%'`;
    }

    const query = `
        SELECT * FROM orders
        WHERE 1=1 ${searchSQL}
        ORDER BY orderTime DESC
        LIMIT ?, ?;
    `;

    const countQuery = `
        SELECT COUNT(*) AS totalRows FROM orders
        WHERE 1=1 ${searchSQL};
    `;

    db.query(countQuery, (err, result) => {
        if (err) throw err;
        const totalRows = result[0].totalRows;
        const totalPageNum = Math.ceil(totalRows / offset);

        db.query(query, [(page - 1) * offset, offset], (err, orders) => {
            if (err) {
                res.status(500).send({ message: "서버 오류", error: err });
            } else {
                res.json({
                    orders,
                    page,
                    totalPageNum,
                    totalRows,
                });
            }
        });
    });
};

exports.getOrderDetails = (req, res) => {
  const { idx } = req.params;

  const query = `SELECT * FROM orders WHERE idx = ?;`;
  db.query(query, [idx], (err, results) => {
    if (err) {
      return res.status(500).send({ message: "서버 오류", error: err });
    }
    if (results.length > 0) {
      res.json({ order: results[0] });
    } else {
      res.status(404).send({ message: "주문을 찾을 수 없습니다." });
    }
  });
};

// 주문 삭제
exports.deleteOrder = (req, res) => {
    const idx = req.params.idx; // URL로부터 idx 값을 가져옴

    const query = `
        DELETE FROM orders
        WHERE idx = ?;
    `;

    db.query(query, [idx], (err, result) => {
        if (err) {
            res.status(500).send({ message: "주문 삭제 중 오류가 발생했습니다.", error: err });
        } else if (result.affectedRows === 0) {
            res.status(404).send({ message: "해당 주문을 찾을 수 없습니다." });
        } else {
            res.status(201).send({ message: "주문이 성공적으로 삭제되었습니다." });
        }
    });
};



// 로직명
exports.xxxxxx = (req, res) => {};
