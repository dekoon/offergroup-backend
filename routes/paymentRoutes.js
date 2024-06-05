//routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
//
router.get("/pays/:userId", paymentController.payMultiItems);
router.post("/pays/:userId", paymentController.saveMultiOrder);
router.post("/stockStatus0/:userId", paymentController.updateStockStatusToZero);
router.post("/stockStatus2/:userId", paymentController.updateStockStatusToTwo);
module.exports = router;
