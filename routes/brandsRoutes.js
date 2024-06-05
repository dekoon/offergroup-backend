// routes/brandsRoutes.js
const db = require("../config/db"); // DB 설정 가져오기
const upload = require("../config/multerConfig");
const express = require("express");
const router = express.Router();

const brandsController = require("../controllers/brandsController");

//브랜드가져오기
router.get("/", brandsController.getAllBrands);

// brandsRoutes.js
router.get("/brandinfo/:brandEnName", brandsController.getbrandinfo);


// 관리자 페이지에서 브랜드 목록 보이기
router.get("/brandsManager", brandsController.brandsManager);

// 브랜드 등록
router.post(
  "/addBrand",
  upload.fields([{ name: "attach" }]),
  brandsController.addBrand
);

// 브랜드 삭제
router.delete("/delete/:idx", brandsController.deleteBrand);

// 이미지 삭제
router.delete("/deleteImage/:idx", brandsController.deleteImage);

// 브랜드 한 개 불러오기 (수정 페이지용)
router.get("/updateBrand/:idx", brandsController.updateBrandForm);

// 브랜드 수정
router.put(
  "/updateBrand/:idx",
  upload.single("attach"),
  brandsController.updateBrand
);

// 브랜드 상세보기
router.get("/detail/:idx", brandsController.detailBrand);


module.exports = router;