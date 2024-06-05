// routes/myorderRoutes.js
const express = require("express");
const router = express.Router();
const myorderController = require("../controllers/myorderController");

// 주문목록 조회
router.get("/:userId", myorderController.getUserOrders);

// 주문취소
router.put("/cancel/:orderIdx", myorderController.cancelOrder);

// 취소 요청된 주문목록 조회
router.get("/cancelledorders/:userId", myorderController.getCancelledOrders);

// 주문 상세 정보 조회
router.get("/orderdetail/:orderId", myorderController.getOrderDetail);

module.exports = router;
