// config/multerConfig.js
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // 파일 시스템 모듈 추가

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // 파일 유형에 따라 저장 디렉토리 설정
    let uploadDir = "./uploads"; // 기본 업로드 디렉토리

    // 요청 URL을 기준으로 폴더 구분
     if (
       req.baseUrl.includes("/api/items") &&
       req.path.includes("/uploadImage")
     ) {
       uploadDir = "./uploads/itemDetails"; // 에디터 이미지 업로드 폴더
     } else if (req.baseUrl.includes("/api/brands")) {
       uploadDir = "./uploads/brands";
     } else if (req.baseUrl.includes("/api/photos")) {
       uploadDir = "./uploads/photo";
     } else if (req.baseUrl.includes("/api/users")) {
       uploadDir = "./uploads/userimg";
     } else if (req.baseUrl.includes("/api/events")) {
       uploadDir = "./uploads/events";
     } else if (req.baseUrl.includes("/api/coupons")) {
       uploadDir = "./uploads/coupons";
     } else if (req.baseUrl.includes("/api/items")) {
       uploadDir = "./uploads/items";
     } else if (req.baseUrl.includes("/api/notice")) {
       uploadDir = "./uploads/notice";
     } else if (req.baseUrl.includes("/api/boards")) {
       uploadDir = "./uploads/board";
     } else if (
       req.baseUrl.includes("/api/boards") &&
       req.path.includes("/boardDetails")
     ) {
       uploadDir = "./uploads/boardDetails";
     }

    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname); // 파일명 설정
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
