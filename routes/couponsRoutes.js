// routes/couponsRoutes.js
const db = require("../config/db"); // DB 설정 가져오기
const upload = require("../config/multerConfig");
const express = require("express");
const router = express.Router();

const couponsController = require("../controllers/couponsController");

//쿠폰가져오기
router.get("/", couponsController.getAllCoupons);

// 관리자 페이지에서 쿠폰 목록 보이기
router.get("/couponsManager", couponsController.couponsManager);

// 쿠폰 등록
router.post(
  "/addCoupon",
  upload.fields([{ name: "attach" }]),
  couponsController.addCoupon
);

// 쿠폰 삭제
router.delete("/delete/:idx", couponsController.deleteCoupon);

// 이미지 삭제
router.delete("/deleteImage/:idx", couponsController.deleteImage);

// 쿠폰 한 개 불러오기 (수정 페이지용)
router.get("/updateCoupon/:idx", couponsController.updateCouponForm);

// 쿠폰 수정
router.put(
  "/updateCoupon/:idx",
  upload.single("attach"),
  couponsController.updateCoupon
);

// 쿠폰 상세보기
router.get("/detail/:idx", couponsController.detailCoupon);

module.exports = router;
