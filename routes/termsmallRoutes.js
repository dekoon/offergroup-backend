//termsmallRoutes.js;
const express = require("express");
const router = express.Router();
const termsmallController = require("../controllers/termsmallController");

// POST /api/termsmall
router.get("/all", termsmallController.getAlltermsMall);
router.get("/", termsmallController.getTermsMall);
//
router.post("/personal-info", termsmallController.createPersonalInfo);
router.post("/service-use", termsmallController.createServiceUse);
router.post("/company-intro", termsmallController.createCompanyIntro);

module.exports = router;
