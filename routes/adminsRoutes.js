// routes/adminRoutes.js
const db = require("../config/db"); // DB 설정 가져오기
const upload = require("../config/multerConfig");
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// 관리자 목록 조회
router.get("/list", adminController.list);

// 관리자 쓰기
router.post("/create", upload.none(), adminController.create);

// 관리자 읽기
router.get("/read/:idx", adminController.read);

// 관리자 수정
router.put("/update/:idx", upload.none(), adminController.update);

// 관리자 삭제
router.delete("/delete/:idx", adminController.delete);

//관리자로그인
router.post("/login", adminController.login);

module.exports = router;
