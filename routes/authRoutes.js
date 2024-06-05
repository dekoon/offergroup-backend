// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const upload = require("../config/multerConfig");

router.post("/regist", upload.single("profileimage"), authController.register);
router.post("/idDuplicatonChk", authController.checkIdDuplication);
router.post("/login", authController.login);
router.get("/mypage/:userId", authController.getMyPage);
router.post("/mypage/edit/:userId", authController.editMyPage);

module.exports = router;
