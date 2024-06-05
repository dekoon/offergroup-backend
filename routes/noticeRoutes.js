// routes/noticeRoutes.js
const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/noticeController");
const upload = require("../config/multerConfig");

// 게시글 목록 조회
router.get("/list", noticeController.list);

// 게시글 쓰기
router.post("/create", upload.single("filepath"), noticeController.create);

// 게시글 읽기
router.get("/read/:idx", noticeController.read);

// 게시글 수정
router.put("/update/:idx", upload.single("filepath"), noticeController.update);

// 게시글 삭제
router.delete("/delete/:idx", noticeController.delete);

module.exports = router;