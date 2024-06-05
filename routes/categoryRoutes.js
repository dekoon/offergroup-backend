//routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

// 대분류 카테고리 category1 불러오기, 추가, 수정, 삭제
router.post("/getCate1", categoryController.getCate1);
router.post("/addCate1", categoryController.addCate1);
router.put("/updateCategory1/:categoryId", categoryController.updateCategory1);
router.delete(
  "/deleteCategory1/:categoryId",
  categoryController.deleteCategory1
);

// 소분류 카테고리 category2 불러오기, 추가, 수정, 삭제
router.post("/getCate2", categoryController.getCate2);
router.post("/addCate2", categoryController.addCate2);
router.put("/updateCategory2/:categoryId", categoryController.updateCategory2);
router.delete(
  "/deleteCategory2/:categoryId",
  categoryController.deleteCategory2
);


module.exports = router;
