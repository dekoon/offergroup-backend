// routes/eventsRoutes.js
const db = require("../config/db"); // DB 설정 가져오기
const upload = require("../config/multerConfig");
const express = require("express");
const router = express.Router();

const eventsController = require("../controllers/eventsController");

//이벤트가져오기
router.get("/", eventsController.getAllEvents);

// 관리자 페이지에서 이벤트 목록 보이기
router.get("/eventsManager", eventsController.eventsManager);

// 이벤트 등록
router.post(
  "/addEvent",
  upload.fields([{ name: "attach" }]),
  eventsController.addEvent
);

// 이벤트 삭제
router.delete("/delete/:idx", eventsController.deleteEvent);

// 이미지 삭제
router.delete("/deleteImage/:idx", eventsController.deleteImage);

// 이벤트 한 개 불러오기 (수정 페이지용)
router.get("/updateEvent/:idx", eventsController.updateEventForm);

// 이벤트 수정
router.put(
  "/updateEvent/:idx",
  upload.single("attach"),
  eventsController.updateEvent
);

// 이벤트 상세보기
router.get("/detail/:idx", eventsController.detailEvent);

module.exports = router;
