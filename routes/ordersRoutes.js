//routes/ordersRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const myorderController = require("../controllers/ordersController");
//
// 주문목록 조회
router.get("/ordersManager", myorderController.getOrders);
// 주문 삭제
router.delete("/delete/:idx", myorderController.deleteOrder);


module.exports = router;
