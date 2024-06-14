//controllers/dashboardController.js
const bcrypt = require("bcrypt");
const db = require("../config/db");
const saltRounds = 10;

// 할 일 목록 조회
exports.todoList = (req, res) => {
  let sql = "SELECT * FROM boardtodoList ORDER BY idx DESC limit 0, 5";
  db.query(sql, (err, lists) => {
    if (err) {
      throw err;
    } else {
      res.send({
        lists,
      });
    }
  });
};

//오늘의 주문 수 조회
exports.getNumOfOrders = (req, res) => {
  const date = new Date();

  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const dateStr = year + "-" + month + "-" + day;

  console.log(dateStr);

  let sql = "SELECT COUNT(idx) AS cnt FROM orders WHERE DATE(orderTime)=?;";

  db.query(sql, dateStr, (err, recentOrders) => {
    if (err) {
      throw err;
    } else {
      res.send({
        recentOrders,
      });
    }
  });
};

// 금일 판매 수입 조회
exports.getTodaysRevenue = (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const query = `
        SELECT SUM(totalPrice) AS totalPrice FROM orders
        WHERE orderTime >= ? AND orderTime < ?;
    `;

    db.query(query, [today, tomorrow], (err, result) => {
        if (err) {
            res.status(500).send({ message: "서버 오류", error: err });
        } else {
            res.json({ revenue: result[0].totalPrice });
        }
    });
};
// 금일 주문 건수 조회
exports.getTodaysOrderCount = (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const query = `
        SELECT COUNT(*) AS count FROM orders
        WHERE orderTime >= ? AND orderTime < ?;
    `;

    db.query(query, [today, tomorrow], (err, result) => {
        if (err) {
            res.status(500).send({ message: "서버 오류", error: err });
        } else {
            res.json({ count: result[0].count });
        }
    });
};

// 최근 주문 목록 조회
exports.getRecentOrders = (req, res) => {
  const limit = req.query.limit || 5; // 기본적으로 5개의 주문만 가져옴

  const query = `
        SELECT * FROM orders
        ORDER BY orderTime DESC
        LIMIT ?;
    `;

  db.query(query, [limit], (err, orders) => {
    if (err) {
      res.status(500).send({ message: "서버 오류", error: err });
    } else {
      res.json(orders);
    }
  });
};


// 지난달 판매 금액 조회
exports.getLastMonthRevenue = (req, res) => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    const query = `
        SELECT SUM(totalPrice) AS revenue FROM orders
        WHERE orderTime >= ? AND orderTime <= ?;
    `;

    db.query(query, [firstDayOfMonth, lastDayOfMonth], (err, result) => {
        if (err) {
            res.status(500).send({ message: "서버 오류", error: err });
        } else {
            res.json({ revenue: result[0].revenue });
        }
    });
};

// 이번달 판매 금액 조회
exports.getCurrentMonthRevenue = (req, res) => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const query = `
        SELECT SUM(totalPrice) AS revenue FROM orders
        WHERE orderTime >= ? AND orderTime <= ?;
    `;

    db.query(query, [firstDayOfMonth, lastDayOfMonth], (err, result) => {
        if (err) {
            res.status(500).send({ message: "서버 오류", error: err });
        } else {
            res.json({ revenue: result[0].revenue });
        }
    });
};


// 전체 상품 수 조회
exports.getTotalItemCount = (req, res) => {
    const query = "SELECT COUNT(*) AS totalItems FROM item;";
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: "Database query error" });
        }
        res.send({ totalItems: result[0].totalItems });
    });
};

// 판매 가능한 상품 수 조회 (stock_status 값이 1인 상품 수)
exports.getAvailableItemCount = (req, res) => {
    const query = "SELECT COUNT(*) AS availableItems FROM item WHERE stock_status = 1;";
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: "Database query error" });
        }
        res.send({ availableItems: result[0].availableItems });
    });
};

// 렌탈중인 상품 수 조회 (stock_status 값이 2인 상품 수)
exports.getRentedItemCount = (req, res) => {
    const query = "SELECT COUNT(*) AS rentedItems FROM item WHERE stock_status = 2;";
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: "Database query error" });
        }
        res.send({ rentedItems: result[0].rentedItems });
    });
};

// 최근 렌탈 목록 5개 조회
exports.getRecentRent = (req, res) => {
    const query = `
        SELECT * FROM orders
        WHERE selectedMonth != 1
        ORDER BY orderTime DESC
        LIMIT 5;
    `;
    db.query(query, (err, orders) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: "Database query error" });
        }
        res.send(orders);
    });
};
