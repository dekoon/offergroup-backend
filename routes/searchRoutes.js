//routes/searchRoutes.js

const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");

// 경로와 컨트롤러의 메소드를 연결

router.get("/searchitem", (req, res) => {
  searchController.searchManager(req, res, "item");
});

router.get("/searchorder", (req, res) => {
  searchController.searchManager(req, res, "orders");
});


module.exports = router;
