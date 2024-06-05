//termsmallRoutes.js;
const express = require("express");
const router = express.Router();
const termsmallController = require("../controllers/termsmallController");

// POST /api/termsmall
router.get("/all", termsmallController.getAlltermsMall);
router.get("/", termsmallController.getTermsMall);
router.post("/", termsmallController.createTermsMall);

module.exports = router;
