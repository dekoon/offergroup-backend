//companyinfoRoutes.js;
const express = require("express");
const router = express.Router();
const companyinfoController = require("../controllers/companyinfoController");

// POST /api/companyinfo
router.get("/all", companyinfoController.getAllCompanyInfo);
router.get("/", companyinfoController.getCompanyinfo);
router.post("/", companyinfoController.createCompanyinfo);

module.exports = router;
