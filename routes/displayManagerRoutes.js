//routes/displayManagerRoutes.js
const db = require("../config/db"); // DB 설정 가져오기
const express = require("express");
const router = express.Router();
const displayManagerController = require("../controllers/displayManagerController");

router.get("/selected_Brand", displayManagerController.getSelected_Brand);
router.get("/selectable_Brand", displayManagerController.getSelectable_Brand);
router.put("/brand/:brandId/add_Brand", displayManagerController.add_Brand);
router.put("/brand/:brandId/remove_Brand", displayManagerController.remove_Brand);
//
router.get("/selected_Event", displayManagerController.getSelected_Event);
router.get("/selectable_Event", displayManagerController.getSelectable_Event);
router.put("/event/:eventId/add_Event", displayManagerController.add_Event);
router.put("/event/:eventId/remove_Event", displayManagerController.remove_Event);
//
router.get("/selected_norm_Item", displayManagerController.getSelected_Norm_Item);
router.get("/selectable_norm_Item", displayManagerController.getSelectable_Norm_Item);
router.put("/item/:itemId/add_norm_Item", displayManagerController.add_Norm_Item);
router.put("/item/:itemId/remove_norm_Item", displayManagerController.remove_Norm_Item);
//

router.get("/selected_Ftd_Item", displayManagerController.getSelected_Ftd_Item);
router.get("/selectable_Ftd_Item", displayManagerController.getSelectable_Ftd_Item);
router.put("/item/:itemId/add_Ftd_Item", displayManagerController.add_Ftd_Item);
router.put("/item/:itemId/remove_Ftd_Item", displayManagerController.remove_Ftd_Item);

//router.post("/update_Main_display_Ftd_items", displayManagerController.update_Main_display_Ftd_items);
//


module.exports = router;
