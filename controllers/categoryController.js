//controllers/categoryController.js
const bcrypt = require("bcrypt");
const db = require("../config/db");
const saltRounds = 10;

// 대분류 카테고리 category1
exports.getCate1 = (req, res) => {
  let sql = "SELECT * FROM category1 ORDER BY id ASC;";
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send({ message: "대분류 카테고리 조회 중 오류가 발생했습니다." });
    }
    res.send(result);
  });
};


// 대분류 카테고리 category1 추가
exports.addCate1 = (req, res) => {
  const { category1, Code_cate1 } = req.body;
  const sql = "INSERT INTO category1 (category1, Code_cate1) VALUES (?, ?);";
  db.query(sql, [category1, Code_cate1], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send({ message: "대분류 카테고리 추가 중 오류가 발생했습니다." });
    }
    res.send({ message: "대분류 카테고리가 성공적으로 추가되었습니다." });
  });
};

//대분류 카테고리 category1 삭제
exports.deleteCategory1 = (req, res) => {
  const categoryId = req.params.categoryId;
  const sql = "DELETE FROM category1 WHERE id = ?";
  db.query(sql, categoryId, (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send({ message: "대분류 카테고리 삭제 중 오류가 발생했습니다." });
    }
    res.send({ message: "대분류 카테고리가 성공적으로 삭제되었습니다." });
  });
};

//대분류 카테고리 category1 수정
//대분류 카테고리 category1 수정
exports.updateCategory1 = (req, res) => {
  const categoryId = req.params.categoryId;
  const { category1, Code_cate1 } = req.body;  // 이 변수들이 요청 본문에서 올바르게 받아지는지 확인
  const sql = "UPDATE category1 SET category1 = ?, Code_cate1 = ? WHERE id = ?";  // SQL 쿼리가 올바른지 확인
  db.query(sql, [category1, Code_cate1, categoryId], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send({ message: "대분류 카테고리 수정 중 오류가 발생했습니다." });
    }
    res.send({ message: "대분류 카테고리가 성공적으로 수정되었습니다." });
  });
};


exports.getCate2 = (req, res) => {
  let sql = "SELECT * FROM category2 WHERE category1 = ?;";
  const { cate1 } = req.body;
  db.query(sql, [cate1], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send({ message: "소분류 카테고리 조회 중 오류가 발생했습니다." });
    }
    res.send(result);
  });
};


// 소분류 카테고리 category1 추가
exports.addCate2 = (req, res) => {
  const { category2, category1, Code_cate2 } = req.body;
  const sql = "INSERT INTO category2 (category2, category1, Code_cate2) VALUES (?, ?, ?);";
  db.query(sql, [category2, category1, Code_cate2], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send({ message: "소분류 카테고리 추가 중 오류가 발생했습니다." });
    }
    res.send({ message: "소분류 카테고리가 성공적으로 추가되었습니다." });
  });
};

// 소분류 카테고리 category2 삭제
exports.deleteCategory2 = (req, res) => {
  const categoryId = req.params.categoryId;
  const sql = "DELETE FROM category2 WHERE id = ?";
  db.query(sql, categoryId, (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send({ message: "소분류 카테고리 삭제 중 오류가 발생했습니다." });
    }
    res.send({ message: "소분류 카테고리가 성공적으로 삭제되었습니다." });
  });
};

// 소분류 카테고리 category2 수정
exports.updateCategory2 = (req, res) => {
  const categoryId = req.params.categoryId;
  const { category2, Code_cate2 } = req.body;
  const sql = "UPDATE category2 SET category2 = ?, Code_cate2 = ? WHERE id = ?";
  db.query(sql, [category2, Code_cate2, categoryId], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .send({ message: "소분류 카테고리 수정 중 오류가 발생했습니다." });
    }
    res.send({ message: "소분류 카테고리가 성공적으로 수정되었습니다." });
  });
};
