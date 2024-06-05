//routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const upload = require("../config/multerConfig");

// 장바구니에 상품 추가
router.post("/cart/:userId/:idx", cartController.addToCart);
// 특정 사용자의 장바구니 목록 조회
router.get("/cart/:userId", cartController.getCart);
// 장바구니에서 상품 제거
router.delete("/delItem/:idx", cartController.removeItem);
// 장바구니 비우기
router.delete("/delItemAll/:userId", cartController.removeAllItems);
// 특정 사용자의 장바구니 아이템 개수 조회
router.get("/cartItemCount/:userId", cartController.getCartItemCount);
// 선택한 아이템 삭제
router.post("/delSelectedItems", cartController.removeSelectedItems);
module.exports = router;