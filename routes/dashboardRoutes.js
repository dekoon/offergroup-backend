// routes/dashboardRouters.js
const db = require("../config/db-dev"); // DB 설정 가져오기
const upload = require("../config/multerConfig");
const express = require("express");
const router = express.Router();
//
const dashboardController = require("../controllers/dashboardController");
// 최근주문 목록 조회
router.get("/recentorder", dashboardController.getRecentOrders);
// 금일 주문 건수 조회
router.get("/todaysordercount", dashboardController.getTodaysOrderCount);
// 금일 판매 금액 조회
router.get("/todaysrevenue", dashboardController.getTodaysRevenue);

// 이번달 판매 금액 조회
router.get("/currentmonthrevenue", dashboardController.getCurrentMonthRevenue);

// 지난달 판매 금액 조회
router.get("/lastmonthrevenue", dashboardController.getLastMonthRevenue);

// 전체 상품 수 조회
router.get("/totalitemcount", dashboardController.getTotalItemCount);

// 판매 가능한 상품 수 조회 (stock_status 값이 1인 상품 수)
router.get("/availableitemcount", dashboardController.getAvailableItemCount);

// 렌탈중인 상품 수 조회 (stock_status 값이 2인 상품 수)
router.get("/renteditemcount", dashboardController.getRentedItemCount);

// 최근렌탈 목록 조회
router.get("/recentrent", dashboardController.getRecentRent);

module.exports = router;