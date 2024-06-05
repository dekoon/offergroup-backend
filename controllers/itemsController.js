//controllers/itemsController.js;
const express = require("express");
const router = express.Router();
const db = require("../config/db-dev");
const itemsController = require("../controllers/itemsController");
const upload = require("../config/multerConfig");

// 메인페이지 상품 목록
exports.mainPageItems = (req, res) => {
  let sql = "SELECT * FROM item ORDER BY idx DESC;";
  db.query(sql, (err, items) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Database query error" });
    }
    res.send(items);
  });
};

// 상품명으로 검색
exports.itemSearch = (req, res) => {
  let sql = "SELECT * FROM item WHERE itemname LIKE ? ORDER BY idx DESC;";
  db.query(sql, [`%${req.query.keyword}%`], (err, items) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Database query error" });
    }
    res.send({ status: 201, items });
  });
};





// 관리자/사용자페이지 상품목록
exports.goodsManager = (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const offset = parseInt(req.query.offset, 10) || 10;
  const itembrand_en = req.query.itembrand_en;
  const type = req.query.type || "";
  const categoryCode1 = req.query.categoryCode1;
  const categoryCode2 = req.query.categoryCode2;
  const startNum = (page - 1) * offset;

  let whereClause = " WHERE 1=1";
  let queryParams = [];

  if (categoryCode1) {
    whereClause += " AND categoryCode1 = ?";
    queryParams.push(categoryCode1);
  }

  if (categoryCode2) {
    whereClause += " AND categoryCode2 = ?";
    queryParams.push(categoryCode2);
  }

 if (itembrand_en && itembrand_en !== "null") {
   whereClause += " AND itembrand_en = ?";
   queryParams.push(itembrand_en);
 }


  if (type === "BEST" || type === "NEW") {
    whereClause += ` AND labels LIKE '%${type}%'`;
  } else if (type === "SALE") {
    whereClause += " AND sale <> 0";
  }



  let sql = `SELECT count(idx) AS cnt FROM item${whereClause};`;
  console.log("Final SQL Query:", sql);
  console.log("Query Parameters:", queryParams);

  db.query(sql, queryParams, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Database query error" });
    }
    const totalRows = data[0].cnt;
    const totalPageNum = Math.ceil(totalRows / offset);

    let listSQL = `SELECT *, stock_status FROM item${whereClause} ORDER BY idx DESC LIMIT ?, ?;`;
    queryParams.push(startNum, offset);

    db.query(listSQL, queryParams, (err, items) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Database query error" });
      }
      res.send({
        items,
        page,
        totalRows,
        totalPageNum,
      });
    });
  });
};



//상품코드생성기
exports.generateCode = (req, res) => {
  const { categoryCode1, categoryCode2 } = req.query;
  const sql =
    "SELECT itemCode FROM item WHERE itemCode LIKE ? ORDER BY itemCode DESC LIMIT 1;";
  const searchPattern = `${categoryCode1}${categoryCode2}%`;

  db.query(sql, [searchPattern], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Database query error" });
    }

    let newSerial = 1;
    if (results.length > 0) {
      const lastCode = results[0].itemCode;
      const lastSerial = parseInt(lastCode.substring(6)) + 1; // 마지막 4자리 숫자를 증가
      newSerial = lastSerial;
    }

    const newCode = `${categoryCode1}${categoryCode2}${String(
      newSerial
    ).padStart(4, "0")}`;
    res.send({ generatedCode: newCode });
  });
};

// 상품등록
// 상품등록
exports.addItem = (req, res) => {
  console.log(req.file);

  const {
    itemname,
    itemname_en,
    itembrand,
    itembrand_en,
    itemCategory1,
    itemCategory2,
    stock_status,
    itemCode,
    price,
    pricemonthly,
    discount,
    sale,
    labels,
    contents,
  } = req.body;

  // categoryCode1, categoryCode2 상태를 사용하여 idx 값 가져오기
  const categoryCode1 = req.body.categoryCode1;
  const categoryCode2 = req.body.categoryCode2;

  // 파일이 첨부되었는지 확인하고, 없으면 기본값을 null로 설정
  const filename = req.files && req.files.attach ? req.files.attach[0].filename : null;
  const filename2 = req.files && req.files.attach2 ? req.files.attach2[0].filename : null;
  const filename3 = req.files && req.files.attach3 ? req.files.attach3[0].filename : null;


  let sql =
    "INSERT INTO item (itemname, itemname_en, itembrand, itembrand_en, itemCategory1, itemCategory2, categoryCode1, categoryCode2, stock_status, itemCode, price, pricemonthly, discount, sale, labels, attach, attach2, attach3, contents, regdate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW());";

    db.query(
    sql,
    [
      itemname,
      itemname_en,
      itembrand,
      itembrand_en,
      itemCategory1,
      itemCategory2,
      categoryCode1,
      categoryCode2,
      stock_status,
      itemCode,
      price,
      pricemonthly,
      discount,
      sale,
      labels,
      filename,
      filename2,
      filename3,
      contents,
    ],
    (err) => {
      if (err) {
        throw err;
      }
      res.send({ status: 201, message: "상품등록이 완료되었습니다!" });
    }
  );
};

// 상품삭제
exports.deleteItem = (req, res) => {
  let sql = "DELETE FROM item WHERE idx=?;";
  db.query(sql, [req.params.idx], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Error deleting item" });
    }
    res.send({ status: 201, message: "상품이 삭제되었습니다." });
  });
};

// 상품 한 개 불러오기 (수정 페이지용)
exports.getItem = (req, res) => {
  let sql = "SELECT * FROM item WHERE idx = ?;";
  console.log("수정할 상품을 불러오는 쿼리:", sql); // 쿼리 확인용 console.log
  console.log("요청된 상품 idx:", req.params.idx); // 요청된 idx 확인용 console.log
  db.query(sql, [req.params.idx], (err, response) => {
    if (err) {
      console.error("데이터베이스 쿼리 에러:", err); // 에러 발생 시 에러 메시지 출력
      throw err;
    }
    console.log("불러온 상품 정보:", response); // 불러온 상품 정보 출력
    res.send(response);
  });
};


// 이미지 삭제 기능
exports.deleteImage = (req, res) => {
  const { idx } = req.params;

  // 먼저 데이터베이스에서 해당 상품의 정보를 조회
  db.query(
    "SELECT filename FROM item WHERE idx = ?",
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
        const filePath = `./uploads/items/${results[0].filename}`;

        // 파일 시스템에서 파일 삭제
        const fs = require("fs");
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send({ error: "Failed to delete the file" });
          }

          // 파일 삭제 성공 후, 데이터베이스에서 파일명 업데이트
          db.query(
            "UPDATE item SET filename = NULL WHERE idx = ?",
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

// 상품 수정
exports.updateItem = (req, res) => {
  const {
    itemname,
    itemname_en,
    itembrand,
    itembrand_en,
    category,
    stock_status,
    itemCode,
    price,
    pricemonthly,
    discount,
    sale,
    labels,
    contents,
  } = req.body;
  let filename = req.file ? req.file.filename : null; // 파일이 업로드되지 않은 경우를 고려하여 filename 변수를 설정합니다.

  let sql = "UPDATE item SET ";
  let values = [];
  let updates = [];

  if (itemname) {
    updates.push("itemname = ?");
    values.push(itemname);
  }
  if (itemname_en) {
    updates.push("itemname_en = ?");
    values.push(itemname_en);
  }
  if (itembrand) {
    updates.push("itembrand = ?");
    values.push(itembrand);
  }
    if (itembrand_en) {
      updates.push("itembrand_en = ?");
      values.push(itembrand_en);
    }
  if (category) {
    updates.push("category = ?");
    values.push(category);
  }
  if (stock_status) {
    updates.push("stock_status = ?");
    values.push(stock_status);
  }
  if (itemCode) {
    updates.push("itemCode = ?");
    values.push(itemCode);
  }
  if (price) {
    updates.push("price = ?");
    values.push(price);
  }
  if (pricemonthly) {
    updates.push("pricemonthly = ?");
    values.push(pricemonthly);
  }
    if (contents) {
      updates.push("contents = ?");
      values.push(contents);
    }
    if (discount) {
      updates.push("discount = ?");
      values.push(discount);
    }
    if (sale) {
        updates.push("sale = ?");
        values.push(sale);
      }
       if (labels) {
         updates.push("labels = ?");
         values.push(labels);
       }

  if (filename) {
    updates.push("attach = ?");
    values.push(filename);
  }
  if (contents) {
    updates.push("contents = ?");
    values.push(contents);
  }


  sql += updates.join(", ");
  sql += ", regdate = now() ";
  sql += "WHERE idx = ?";

  values.push(req.params.idx);

  db.query(sql, values, (err) => {
    if (err) {
      throw err;
    } else {
      console.log("update complete");
      res.send({ status: 201, message: "상품 수정 완료" });
    }
  });
};

// 상품 상세보기
exports.detailItem = (req, res) => {
  let sql = "SELECT * FROM item WHERE idx = ?;";
  db.query(sql, [req.params.idx], (err, item) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Database query error" });
    }
    res.send(item);
  });
};

//상품상세이미지업로더
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).send("No image uploaded");
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/itemDetails/${
    req.file.filename
  }`;
  res.json({ url: imageUrl });
};
