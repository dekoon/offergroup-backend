// routes/termsasRoutes.js
const express = require("express");
const router = express.Router();
const termsasController = require("../controllers/termsasController");
const upload = require("../config/multerConfig");

// FAQ 목록 조회
router.get("/list", termsasController.list);

// FAQ 쓰기
router.post("/create", upload.none(), termsasController.create);

// FAQ 읽기
router.get("/read/:idx", termsasController.read);

// FAQ 수정
router.put("/update/:idx", upload.none(), termsasController.update);

// FAQ 삭제
router.delete("/delete/:idx", termsasController.delete);

module.exports = router;
