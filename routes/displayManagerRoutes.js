//routes/displayManagerRoutes.js
const db = require("../config/db"); // DB 설정 가져오기
const express = require("express");
const router = express.Router();
const displayManagerController = require("../controllers/displayManagerController");

router.get("/selectable_Coupons", displayManagerController.getSelectable_Coupons);
router.post("/update_Main_display_Coupons", displayManagerController.update_Main_display_Coupons);
//
router.get("/selectable_Brands", displayManagerController.getSelectable_Brands);
router.post("/update_Main_display_Brands", displayManagerController.update_Main_display_Brands);
//
router.get("/selectable_Events", displayManagerController.getSelectable_Events);
router.post("/update_Main_display_Events", displayManagerController.update_Main_display_Events);
//
router.get("/selected_Items", displayManagerController.getSelected_Items);
router.get("/selectable_Items", displayManagerController.getSelectable_Items);
router.post("/update_Main_display_Items", displayManagerController.update_Main_display_Items);
//

router.get("/selected_Ftd_items", displayManagerController.getSelected_Ftd_items);
router.get("/selectable_Ftd_Item", displayManagerController.getSelectableFtdItem);
router.put("/item/:itemId/add", displayManagerController.addItemToDisplay);
router.put("/item/:itemId/remove", displayManagerController.removeFtdItem);

router.post("/update_Main_display_Ftd_items", displayManagerController.update_Main_display_Ftd_items);
//


module.exports = router;
