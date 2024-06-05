const db = require("../config/db");
const upload = require("../config/multerConfig"); // multerConfig 사용

// 해당 상품 리뷰탭 -> 리뷰 목록
exports.detailReview = (req, res) => {
  let sql = "SELECT * FROM review WHERE ItemNo = ?;";
  db.query(sql, [req.params.idx], (err, reviews) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Database query error" });
    }
    res.send(reviews);
  });
};

// 해당 상품 리뷰 -> 리뷰 작성
exports.addReview = (req, res) => {
  const { writer, contents, rating } = req.body;
  const { filename } = req.file; // multer를 사용하여 첨부파일 처리

  let sql = "INSERT INTO review VALUES(NULL, ?, ?, ?, ?, NOW());";
  db.query(sql, [writer, req.params.idx, filename, contents, rating], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Inserting review failed" });
    }
    res.send({ status: 201, message: "리뷰 등록이 완료되었습니다!" });
  });
};

// 해당 상품 리뷰 상세보기
// 추가적인 함수 구현...
