//controllers/paymentController.js
const db = require("../config/db");

exports.payMultiItems = (req, res) => {
  let userSQL = "SELECT * FROM user WHERE id=?;";
  db.query(userSQL, [req.params.userId], (err, user) => {
    if (err) {
      throw err;
    } else {
      let itemsSQL =
        "SELECT c.*, i.itemname, i.price, i.attach FROM cart AS c JOIN item AS i ON c.itemIdx = i.idx WHERE c.userId=?;";
      db.query(itemsSQL, [req.params.userId], (err, result) => {
        if (err) {
          throw err;
        }
        res.send({ user, result });
      });
    }
  });
};

// 주문번호 생성 함수
function generateOrderNum(callback) {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");

  const datePrefix = `${year}${month}${day}`;

  // 현재 날짜의 마지막 주문 번호 조회
  const query = `SELECT MAX(orderNum) as lastOrderNum FROM orders WHERE orderNum LIKE '${datePrefix}%'`;

  db.query(query, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }

    let orderSequence = "0001";
    if (result[0].lastOrderNum) {
      const lastOrderNum = result[0].lastOrderNum;
      const lastSequence = parseInt(lastOrderNum.slice(-4), 10);
      orderSequence = (lastSequence + 1).toString().padStart(4, "0");
    }

    const orderNum = `${datePrefix}${orderSequence}`;
    callback(null, orderNum);
  });
}


exports.saveMultiOrder = (req, res) => {
  const {
    userId,
    username,
    phone,
    address,
    dest_name,
    dest_phone,
    dest_email,
    dest_zip,
    dest_address,
    orderedItems: items,
  } = req.body;

  generateOrderNum((err, orderNum) => {
    if (err) {
      return res.status(500).send(err);
    }

    const sql = `
      INSERT INTO orders (
        orderNum, itemIdx, userId, username, phone, address, dest_name, dest_phone, dest_email, dest_zip, dest_address, orderedItem, totalPrice, orderTime, selectedMonth, monthlyPayment
      ) VALUES ?`;

    const values = items.map((item) => [
      orderNum,
      item.itemIdx,
      userId,
      username,
      phone,
      address,
      dest_name,
      dest_phone,
      dest_email,
      dest_zip,
      dest_address,
      item.itemname,
      item.itemPrice * item.itemCounter,
      new Date(),
      item.selectedMonth,
      item.monthlyPayment,
    ]);

    db.query(sql, [values], (err) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res
          .status(201)
          .send({ status: 201, message: "주문이 성공적으로 처리되었습니다." });
      }
    });
  });
};



exports.updateStockStatusToZero = (req, res) => {
  const userId = req.params.userId;
  const items = req.body.orderedItems;
  const itemIds = items.map((item) => item.itemIdx); // 상품 ID 추출

  const updateStockQuery = `
    UPDATE item
    SET stock_status = 0
    WHERE idx IN (?);
  `;

  db.query(updateStockQuery, [itemIds], (err) => {
    if (err) {
      console.error("Stock status update failed:", err);
      res.status(500).send({
        message: "재고 상태 업데이트 중 오류가 발생했습니다.",
        error: err,
      });
    } else {
      res.status(200).send({
        status: 200,
        message: "재고 상태가 성공적으로 업데이트되었습니다.",
      });
    }
  });
};

exports.updateStockStatusToTwo = (req, res) => {
  const userId = req.params.userId;
  const items = req.body.orderedItems;
  const itemIds = items.map((item) => item.itemIdx); // 상품 ID 추출

  const updateStockQuery = `
    UPDATE item
    SET stock_status = 2
    WHERE idx IN (?);
  `;

  db.query(updateStockQuery, [itemIds], (err) => {
    if (err) {
      console.error("Stock status update failed:", err);
      res.status(500).send({
        message: "재고 상태 업데이트 중 오류가 발생했습니다.",
        error: err,
      });
    } else {
      res.status(200).send({
        status: 200,
        message: "재고 상태가 성공적으로 업데이트되었습니다.",
      });
    }
  });
};