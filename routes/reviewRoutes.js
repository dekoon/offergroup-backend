const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const upload = require("../config/multerConfig");

// 해당 상품 리뷰탭 -> 리뷰 목록
router.get("/detail/:idx/detailReview", reviewController.detailReview);

// 해당 상품 리뷰 -> 리뷰 작성
router.post(
  "/detail/:idx/addReview",
  upload.single("attach"),
  reviewController.addReview
);

// 해당 상품 리뷰 상세보기
// 추가적인 라우트 구현...

module.exports = router;
