// routes/faqRoutes.js
const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faqController");
const upload = require("../config/multerConfig");


// FAQ 목록 조회
router.get("/list", faqController.list);

// FAQ 쓰기
router.post("/create", upload.none(), faqController.create);

// FAQ 읽기
router.get("/read/:idx", faqController.read);

// FAQ 수정
router.put("/update/:idx", upload.none(), faqController.update);

// FAQ 삭제
router.delete("/delete/:idx", faqController.delete);

module.exports = router;