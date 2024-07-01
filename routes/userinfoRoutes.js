//routes/userinfoRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const userController = require("../controllers/userinfoController");

//관리자 사용자 정보 조회
router.get("/", userController.getAllUser);

// 관리자 페이지에서 사용자 목록 보이기
router.get("/userManager", userController.userManager);

// 사용자 정보 조회
router.get("/user/:userId", userController.getUserInfo);
//
// 사용자 정보 업데이트
router.put("/user/:userId", userController.updateUserInfo);

// 아이디 찾기
router.post("/findUserId", userController.findUserId);

// 비밀번호 찾기
router.post("/findUserPassword", userController.findUserPassword);


module.exports = router;
