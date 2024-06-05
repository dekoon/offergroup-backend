// routes/recentRoutes.js
const db = require("../config/db"); // DB 설정 가져오기
const upload = require("../config/multerConfig");
const express = require("express");
const router = express.Router();


// 최근 본 상품 목록을 저장할 배열
let recentItems = [];

// POST /api/recent/viewed
router.post("/viewed", (req, res) => {
  const { item } = req.body;
  if (recentItems.length >= 10) {
    recentItems.pop();
  }
  recentItems.unshift(item);
  res.status(200).send("Recent item viewed saved.");
});

// GET /api/recent
router.get("/", (req, res) => {
  res.status(200).json(recentItems);
});

module.exports = router;