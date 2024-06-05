//controllers/brandsController.js
const bcrypt = require("bcrypt");
const db = require("../config/db");
const upload = require("../config/multerConfig");
const saltRounds = 10;

// 사용자 브랜드 목록가져오기
exports.getAllBrands = (req, res) => {
  let sql = "SELECT * FROM brands;";
  db.query(sql, (err, brands) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
    } else {
      res.send(brands);
    }
  });
};

// brandsController.js
exports.getbrandinfo = (req, res) => {
  const brandEnName = req.params.brandEnName;
  let sql = "SELECT * FROM brands WHERE brand_name_en = ?;";
  db.query(sql, [brandEnName], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
    } else if (results.length === 0) {
      res.status(404).send({ message: "Brand not found" });
    } else {
      res.send(results[0]);
    }
  });
};



// 관리자/사용자 브랜드 목록보이기
exports.brandsManager = (req, res) => {
  // page와 offset에 대한 기본값 설정
  const page = parseInt(req.query.page) || 1; // 파라미터가 제공되지 않을 경우를 대비
  const offset = parseInt(req.query.offset) || 10; // 파라미터가 제공되지 않을 경우를 대비
  const startNum = (page - 1) * offset;

  let whereClause = "";
  const searchQuery = req.query.searchQuery;
  const select = req.query.select;

  if (searchQuery) {
    if (select === "brand_name_en" || select === "brand_name_ko") {
      whereClause = `WHERE ${select} LIKE '%${searchQuery}%'`;
    } else if (select === "" || select === "all") {
      // "전체" 옵션이 선택되었을 경우
      whereClause = `WHERE brand_name_en LIKE '%${searchQuery}%' OR brand_name_ko LIKE '%${searchQuery}%'`;
    }
  }

  let sql = `SELECT count(idx) AS cnt FROM brands ${whereClause};`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
      return;
    }
    let listSQL = `SELECT * FROM brands ${whereClause} ORDER BY idx DESC LIMIT ?, ?;`;
    db.query(listSQL, [startNum, offset], (err, brands) => {
      if (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
        return;
      }
      res.send({
        brands,
        page,
        totalRows: result[0].cnt,
        totalPageNum: Math.ceil(result[0].cnt / offset),
      });
    });
  });
};

// 브랜드 등록
exports.addBrand = (req, res) => {
  const { brand_name_en, brand_name_ko } = req.body;

  // 중복 검사
  checkBrandNames(brand_name_en, brand_name_ko, res, () => {
    const filename = req.files && req.files.attach && req.files.attach.length > 0 ? req.files.attach[0].filename : null;

    let sql = `INSERT INTO brands (brand_name_en, brand_name_ko, brand_discount, filename, brand_intro, created_at, regdated_at)
               VALUES (?, ?, ?, ?, ?, now(), now());`;

    let queryValues = [brand_name_en, brand_name_ko, req.body.brand_discount, filename, req.body.brand_intro];

    db.query(sql, queryValues, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send({ status: 500, message: "서버 에러 발생, 브랜드 등록 실패" });
      } else {
        res.send({ status: 201, message: "브랜드 등록이 완료되었습니다!" });
      }
    });
  });
};

// 중복 이름 검사
function checkBrandNames(brand_name_en, brand_name_ko, res, callback) {
  db.query(`SELECT COUNT(*) AS count FROM brands WHERE brand_name_en = ? OR brand_name_ko = ?`, [brand_name_en, brand_name_ko], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "데이터베이스 조회 중 오류가 발생했습니다." });
    }
    if (results[0].count > 0) {
      return res.status(409).send({ message: "이미 사용 중인 브랜드 이름입니다." });
    } else {
      callback(); // 중복이 없는 경우, 등록 또는 수정 로직 수행
    }
  });
}

// 브랜드 삭제
exports.deleteBrand = (req, res) => {
let sql = "DELETE FROM brands WHERE idx=?;";
db.query(sql, [req.params.idx], (err) => {
  if (err) {
    res.status(500).send("Failed to delete the brand");
    return;
  }
  res.send({ status: 201, message: "브랜드가 삭제되었습니다." });
});
};



// 이미지 삭제 기능
exports.deleteImage = (req, res) => {
  const { idx } = req.params;

  // 먼저 데이터베이스에서 해당 브랜드의 정보를 조회
  db.query('SELECT filename FROM brands WHERE idx = ?', [idx], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ error: err.message });
    }

    if (results.length > 0 && results[0].filename && results[0].filename !== null) {
      const filePath = `./uploads/brands/${results[0].filename}`;

      // 파일 시스템에서 파일 삭제
      const fs = require('fs');
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send({ error: 'Failed to delete the file' });
        }

        // 파일 삭제 성공 후, 데이터베이스에서 파일명 업데이트
        db.query('UPDATE brands SET filename = NULL WHERE idx = ?', [idx], (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send({ error: 'Database update failed' });
          }
          res.send({ status: 200, message: '이미지가 삭제되었습니다.' });
        });
      });
    } else {
      res.status(404).send({ error: 'No file to delete or already deleted' });
    }
  });
};

// 브랜드 한개 불러오기 (수정 페이지용)
exports.updateBrandForm = (req, res) => {
  const { idx } = req.params;
  let sql = "SELECT * FROM brands WHERE idx = ?;";
  db.query(sql, [req.params.idx], (err, response) => {
    if (err) {
      res.status(500).send("데이터베이스 쿼리 오류");
      return;
    }
    res.send(response);
  });
};

// 브랜드 수정
exports.updateBrand = (req, res) => {
  const { idx } = req.params;
  const {
    brand_name_en,
    brand_name_ko,
    brand_discount,
    brand_intro,
  } = req.body;
  let updates = [];
  let values = [];

  if (brand_name_en) {
    updates.push("brand_name_en = ?");
    values.push(brand_name_en);
  }
  if (brand_name_ko) {
    updates.push("brand_name_ko = ?");
    values.push(brand_name_ko);
  }
  if (req.file && req.file.filename) {
    updates.push("filename = ?");
    values.push(req.file.filename);
  }
  if (brand_discount) {
    updates.push("brand_discount = ?");
    values.push(brand_discount);
  }
  if (brand_intro) {
    updates.push("brand_intro = ?");
    values.push(brand_intro);
  }

  updates.push("regdated_at = now()");

  let sql = `UPDATE brands SET ${updates.join(", ")} WHERE idx = ?;`;
  values.push(req.params.idx);

  db.query(sql, values, (err) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .send({ status: 500, message: "서버에러발생, 브랜드 수정 실패" });
    } else {
      console.log("update complete");
      res.send({ status: 201, message: "브랜드 수정 완료" });
    }
  });
};

// 브랜드 상세보기
exports.detailBrand = (req, res) => {
  const { idx } = req.params;
  let sql = "SELECT * FROM brands WHERE idx = ?;";
  db.query(sql, [req.params.idx], (err, results) => {
    if (err) {
      res.status(500).send("Database query error");
      return;
    }
    console.log(results);
    res.send(results[0]); // 첫 번째 결과만 반환하도록 변경
  });
};
