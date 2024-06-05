//controllers/myorderController.js

const bcrypt = require("bcrypt");
const db = require("../config/db");
const saltRounds = 10;

// My 주문 목록 조회
exports.getUserOrders = (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT orders.*, item.attach
    FROM orders
    JOIN item ON orders.itemIdx = item.idx
    WHERE orders.userId = ?
    ORDER BY orders.orderTime DESC
  `; // 주문 시간 내림차순 정렬, items 테이블과 조인하여 attach 가져오기

  db.query(query, [userId], (err, orders) => {
    if (err) {
      console.error("Error fetching user orders:", err);
      return res.status(500).json({ message: "주문 목록을 가져오는 중에 오류가 발생했습니다." });
    }
    res.status(200).json(orders);
  });
};

// My 주문 취소요청
exports.cancelOrder = (req, res) => {
  const orderIdx = req.params.orderIdx;
  const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' '); // MySQL datetime 포맷에 맞게 현재 시간 설정
  const query = `UPDATE orders SET state = '취소요청', ordercancelTime = ? WHERE idx = ?`;

  db.query(query, [currentTime, orderIdx], (err, result) => {
    if (err) {
      console.error("Error cancelling order:", err);
      return res
        .status(500)
        .json({ message: "주문 취소요청중에 오류가 발생했습니다." });
    }
    res.status(200).json({ message: "주문이 취소요청되었습니다.", cancelledAt: currentTime });
  });
};

// 취소 요청된 주문 목록 조회
exports.getCancelledOrders = (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT orders.*, item.attach
    FROM orders
    JOIN item ON orders.itemIdx = item.idx
    WHERE orders.userId = ? AND orders.state = '취소요청'
    ORDER BY orders.ordercancelTime DESC
  `; // 취소 시간 내림차순 정렬, item 테이블과 조인하여 attach 가져오기

  db.query(query, [userId], (err, orders) => {
    if (err) {
      console.error("Error fetching cancelled orders:", err);
      return res.status(500).json({
        message: "주문취소요청된 목록을 가져오는 중에 오류가 발생했습니다.",
      });
    }
    res.status(200).json(orders);
  });
};
// 주문 상세 정보 조회
exports.getOrderDetail = (req, res) => {
  const orderId = req.params.orderId;
  const query = `
    SELECT orders.*, item.attach
    FROM orders
    JOIN item ON orders.itemIdx = item.idx
    WHERE orders.idx = ?
  `; // 주문 ID로 조인하여 상품 이미지 정보 가져오기

  db.query(query, [orderId], (err, order) => {
    if (err) {
      console.error("Error fetching order detail:", err);
      return res
        .status(500)
        .json({
          message: "주문 상세 정보를 가져오는 중에 오류가 발생했습니다.",
        });
    }
    if (order.length > 0) {
      res.status(200).json(order[0]); // 조인된 결과의 첫 번째 객체 반환
    } else {
      res.status(404).json({ message: "주문 정보가 없습니다." });
    }
  });
};