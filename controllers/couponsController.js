//controllers/couponsController.js
const bcrypt = require("bcrypt");
const db = require("../config/db");
const upload = require("../config/multerConfig");
const saltRounds = 10;

// 사용자 쿠폰 목록가져오기
exports.getAllCoupons = (req, res) => {
  let sql = "SELECT * FROM coupons;";
  db.query(sql, (err, coupons) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
    } else {
      res.send(coupons);
    }
  });
};

// 관리자/사용자 쿠폰 목록보이기
exports.couponsManager = (req, res) => {
  // page와 offset에 대한 기본값 설정
  const page = parseInt(req.query.page) || 1; // 파라미터가 제공되지 않을 경우를 대비
  const offset = parseInt(req.query.offset) || 10; // 파라미터가 제공되지 않을 경우를 대비
  const startNum = (page - 1) * offset;

  let whereClause = "";
  const searchQuery = req.query.searchQuery;
  const select = req.query.select;

  if (searchQuery) {
    if (select === "coupon_title" || select === "coupon_desc") {
      whereClause = `WHERE ${select} LIKE '%${searchQuery}%'`;
    } else if (select === "" || select === "all") {
      // "전체" 옵션이 선택되었을 경우
      whereClause = `WHERE coupon_title LIKE '%${searchQuery}%' OR coupon_desc LIKE '%${searchQuery}%'`;
    }
  }

  let sql = `SELECT count(idx) AS cnt FROM coupons ${whereClause};`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
      return;
    }
    let listSQL = `SELECT * FROM coupons ${whereClause} ORDER BY idx DESC LIMIT ?, ?;`;
    db.query(listSQL, [startNum, offset], (err, coupons) => {
      if (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
        return;
      }
      res.send({
        coupons,
        page,
        totalRows: result[0].cnt,
        totalPageNum: Math.ceil(result[0].cnt / offset),
      });
    });
  });
};

// 쿠폰 등록
exports.addCoupon = (req, res) => {
  const { coupon_state, coupon_title, coupon_desc } = req.body;
  const filename =
    req.files.attach && req.files.attach.length > 0
      ? req.files.attach[0].filename
      : null;

  let sql = `INSERT INTO coupons (coupon_state, coupon_title, coupon_desc, filename, created_at, regdated_at)
             VALUES (?, ?, ?, ?, now(), now());`;

  let queryValues = [
    coupon_state,
    coupon_title,
    coupon_desc,
    filename,
  ];

  db.query(sql, queryValues, (err) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .send({ status: 500, message: "서버에러발생, 쿠폰 등록 실패" });
    } else {
      res.send({ status: 201, message: "쿠폰 등록이 완료되었습니다!" });
    }
  });
};

// 쿠폰 삭제
exports.deleteCoupon = (req, res) => {
  let sql = "DELETE FROM coupons WHERE idx=?;";
  db.query(sql, [req.params.idx], (err) => {
    if (err) {
      res.status(500).send("Failed to delete the coupon");
      return;
    }
    res.send({ status: 201, message: "쿠폰가 삭제되었습니다." });
  });
};

// 이미지 삭제 기능
exports.deleteImage = (req, res) => {
  const { idx } = req.params;

  // 먼저 데이터베이스에서 해당 쿠폰의 정보를 조회
  db.query(
    "SELECT filename FROM coupons WHERE idx = ?",
    [idx],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
      }

      if (
        results.length > 0 &&
        results[0].filename &&
        results[0].filename !== null
      ) {
        const filePath = `./uploads/coupons/${results[0].filename}`;

        // 파일 시스템에서 파일 삭제
        const fs = require("fs");
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send({ error: "Failed to delete the file" });
          }

          // 파일 삭제 성공 후, 데이터베이스에서 파일명 업데이트
          db.query(
            "UPDATE coupons SET filename = NULL WHERE idx = ?",
            [idx],
            (err) => {
              if (err) {
                console.error(err);
                return res
                  .status(500)
                  .send({ error: "Database update failed" });
              }
              res.send({ status: 200, message: "이미지가 삭제되었습니다." });
            }
          );
        });
      } else {
        res.status(404).send({ error: "No file to delete or already deleted" });
      }
    }
  );
};

// 쿠폰 한개 불러오기 (수정 페이지용)
exports.updateCouponForm = (req, res) => {
  const { idx } = req.params;
  let sql = "SELECT * FROM coupons WHERE idx = ?;";
  db.query(sql, [req.params.idx], (err, response) => {
    if (err) {
      res.status(500).send("데이터베이스 쿼리 오류");
      return;
    }
    res.send(response);
  });
};

// 쿠폰 수정
exports.updateCoupon = (req, res) => {
  const { idx } = req.params;
  const { coupon_state, coupon_title, coupon_desc } =
    req.body;
  let updates = [];
  let values = [];

  if (coupon_state) {
    updates.push("coupon_state = ?");
    values.push(coupon_state);
  }
  if (coupon_title) {
    updates.push("coupon_title = ?");
    values.push(coupon_title);
  }
  if (coupon_desc) {
    updates.push("coupon_desc = ?");
    values.push(coupon_desc);
  }
  if (req.file && req.file.filename) {
    updates.push("filename = ?");
    values.push(req.file.filename);
  }


  updates.push("regdated_at = now()");

  let sql = `UPDATE coupons SET ${updates.join(", ")} WHERE idx = ?;`;
  values.push(req.params.idx);

  db.query(sql, values, (err) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .send({ status: 500, message: "서버에러발생, 쿠폰 수정 실패" });
    } else {
      console.log("update complete");
      res.send({ status: 201, message: "쿠폰 수정 완료" });
    }
  });
};

// 쿠폰 상세보기
exports.detailCoupon = (req, res) => {
  const { idx } = req.params;
  let sql = "SELECT * FROM coupons WHERE idx = ?;";
  db.query(sql, [req.params.idx], (err, results) => {
    if (err) {
      res.status(500).send("Database query error");
      return;
    }
    console.log(results);
    res.send(results[0]); // 첫 번째 결과만 반환하도록 변경
  });
};
