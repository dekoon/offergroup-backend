//routesitemsRoutes.js
const express = require("express");
const router = express.Router();
const itemsController = require("../controllers/itemsController");
const upload = require("../config/multerConfig"); // Assuming multerConfig is properly configured

router.get("/main", itemsController.mainPageItems);
router.get("/itemSearch", itemsController.itemSearch);
router.get("/goodsManager", itemsController.goodsManager);

router.post(
  "/addItem",
  upload.fields([{ name: "attach" }, { name: "attach2" }, { name: "attach3" }]),
  itemsController.addItem
);

router.delete("/delete/:idx", itemsController.deleteItem);

router.get("/updateItem/:idx", itemsController.getItem);
router.put(
  "/updateItem/:idx",
  upload.single("attach"),
  itemsController.updateItem
);

router.get("/detail/:idx", itemsController.detailItem);


router.get("/generateCode", itemsController.generateCode);

// 토스트UI API
router.post("/uploadImage", upload.single("file"), itemsController.uploadImage);



module.exports = router;
