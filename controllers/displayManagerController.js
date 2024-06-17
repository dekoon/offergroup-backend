//controllers/displayManagerController.js
const bcrypt = require("bcrypt");
const db = require("../config/db");
const upload = require("../config/multerConfig");
const saltRounds = 10;

// 1x1상품- 메인디스플레이 main_ftd_display =1 불러오기 (사용자,관리자)
exports.getSelected_Ftd_Item = (req, res) => {
  const sql =
    "SELECT idx, itemname, itemname_en, price, sale, attach, main_ftd_display, main_display_title, main_display_summary FROM item WHERE main_ftd_display = 1 ORDER BY idx DESC;";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error in getSelectable_Ftd_items:", err);
      res.status(500).send({ error: err.message });
    } else {
      res.send(results);
    }
  });
};


// 1x1상품- 메인디스플레이 main_ftd_display 값이 0인 상품가져오기 & 페이징처리
exports.getSelectable_Ftd_Item = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const sql = `SELECT idx, itemname, itemname_en, price, sale, attach, main_ftd_display, main_display_title, main_display_summary
               FROM item
               WHERE main_ftd_display = 0
               ORDER BY idx DESC
               LIMIT ?, ?;`;

  const countSql = `SELECT COUNT(idx) AS totalItems FROM item WHERE main_ftd_display = 0;`;

  db.query(countSql, (err, countResults) => {
    if (err) {
      console.error("Database error in getSelectableFtdItem count:", err);
      res.status(500).send({ error: err.message });
    } else {
      db.query(sql, [offset, limit], (err, results) => {
        if (err) {
          console.error("Database error in getSelectableFtdItem:", err);
          res.status(500).send({ error: err.message });
        } else {
          res.send({
            items: results,
            totalItems: countResults[0].totalItems,
            totalPages: Math.ceil(countResults[0].totalItems / limit),
            currentPage: page,
          });
        }
      });
    }
  });
};



// 1x1 상품을 메인 디스플레이에 추가(main_ftd_display 값을 1으로 변경)
exports.add_Ftd_Item = (req, res) => {
  const itemId = req.params.itemId;
  const sql = "UPDATE item SET main_ftd_display = 1 WHERE idx = ?";
  db.query(sql, [itemId], (err, result) => {
    if (err) {
      console.error("Database error in addItemToDisplay:", err);
      res.status(500).send({ error: err.message });
    } else {
      res.status(200).send({
        message: "해당상품을 메인화면 강조상품 레이아웃에서 추가하였습니다.",
      });
    }
  });
};

// 1x1 상품을 메인 디스플레이에서 제거 (main_ftd_display 값을 0으로 변경)
exports.remove_Ftd_Item = (req, res) => {
  const itemId = req.params.itemId;
  const sql = "UPDATE item SET main_ftd_display = 0 WHERE idx = ?";
  db.query(sql, [itemId], (err, result) => {
    if (err) {
      console.error("Database error in hideFtdItem:", err);
      res.status(500).send({ error: err.message });
    } else {
      res
        .status(200)
        .send({
          message: "해당상품을 메인화면 강조상품 레이아웃에서 제거하였습니다.",
        });
    }
  });
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

// 일반상품- 메인디스플레이 main_display =1 불러오기 (사용자,관리자)
exports.getSelected_Norm_Item = (req, res) => {
  const sql =
    "SELECT idx, itemname, price, sale, attach, main_display FROM item WHERE main_display = 1 ORDER BY idx DESC;";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error in getSelectable_Items:", err);
      res.status(500).send({ error: err.message });
    } else {
      res.send(results);
    }
  });
};


// 일반상품- 메인디스플레이 main_display 값이 0인 상품가져오기 & 페이징처리
exports.getSelectable_Norm_Item = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const sql = `SELECT idx, itemname, price, sale, attach, main_display FROM item
               WHERE main_display = 0
               ORDER BY idx DESC
               LIMIT ?, ?;`;

  const countSql = `SELECT COUNT(idx) AS totalItems FROM item WHERE main_display = 0;`;

  db.query(countSql, (err, countResults) => {
    if (err) {
      console.error("Database error in getSelectableFtdItem count:", err);
      res.status(500).send({ error: err.message });
    } else {
      db.query(sql, [offset, limit], (err, results) => {
        if (err) {
          console.error("Database error in getSelectableFtdItem:", err);
          res.status(500).send({ error: err.message });
        } else {
          res.send({
            items: results,
            totalItems: countResults[0].totalItems,
            totalPages: Math.ceil(countResults[0].totalItems / limit),
            currentPage: page,
          });
        }
      });
    }
  });
};

//

// 일반상품- 메인디스플레이에 추가(main_display 값을 1으로 변경)
exports.add_Norm_Item = (req, res) => {
  const itemId = req.params.itemId;
  const sql = "UPDATE item SET main_display = 1 WHERE idx = ?";
  db.query(sql, [itemId], (err, result) => {
    if (err) {
      console.error("Database error in addItemToDisplay:", err);
      res.status(500).send({ error: err.message });
    } else {
      res.status(200).send({
        message: "해당상품을 메인화면 일반상품 레이아웃에서 추가하였습니다.",
      });
    }
  });
};

// 일반상품- 메인디스플레이에서 제거 (main_display 값을 0으로 변경)
exports.remove_Norm_Item = (req, res) => {
  const itemId = req.params.itemId;
  const sql = "UPDATE item SET main_display = 0 WHERE idx = ?";
  db.query(sql, [itemId], (err, result) => {
    if (err) {
      console.error("Database error in hideFtdItem:", err);
      res.status(500).send({ error: err.message });
    } else {
      res
        .status(200)
        .send({
          message: "해당상품을 메인화면 일반상품 레이아웃에서 제거하였습니다.",
        });
    }
  });
};



////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////

// 이벤트- 메인디스플레이 main_display =1 불러오기 (사용자,관리자)
exports.getSelected_Event = (req, res) => {
  const sql =
    "SELECT idx, event_title, event_desc, filename, main_display FROM events WHERE main_display = 1 ORDER BY idx DESC;";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error in getSelectable_Items:", err);
      res.status(500).send({ error: err.message });
    } else {
      res.send(results);
    }
  });
};


// 이벤트- 메인디스플레이 main_display 값이 0인 상품가져오기 & 페이징처리
exports.getSelectable_Event = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const sql = `SELECT idx, event_title, event_desc, filename, main_display FROM events
               WHERE main_display = 0
               ORDER BY idx DESC
               LIMIT ?, ?;`;

  const countSql = `SELECT COUNT(idx) AS totalEvents FROM events WHERE main_display = 0;`;

  db.query(countSql, (err, countResults) => {
    if (err) {
      console.error("Database error in getSelectableFtdItem count:", err);
      res.status(500).send({ error: err.message });
    } else {
      db.query(sql, [offset, limit], (err, results) => {
        if (err) {
          console.error("Database error in getSelectableFtdItem:", err);
          res.status(500).send({ error: err.message });
        } else {
          res.send({
            items: results,
            totalEvents: countResults[0].totalEvents,
            totalPages: Math.ceil(countResults[0].totalEvents / limit),
            currentPage: page,
          });
        }
      });
    }
  });
};

//

// 이벤트- 메인디스플레이에 추가(main_display 값을 1으로 변경)
exports.add_Event = (req, res) => {
  const eventId = req.params.eventId;
  const sql = "UPDATE events SET main_display = 1 WHERE idx = ?";
  db.query(sql, [eventId], (err, result) => {
    if (err) {
      console.error("Database error in addItemToDisplay:", err);
      res.status(500).send({ error: err.message });
    } else {
      res.status(200).send({
        message: "해당상품을 메인화면 일반상품 레이아웃에서 추가하였습니다.",
      });
    }
  });
};

// 이벤트- 메인디스플레이에서 제거 (main_display 값을 0으로 변경)
exports.remove_Event = (req, res) => {
  const eventId = req.params.eventId;
  const sql = "UPDATE events SET main_display = 0 WHERE idx = ?";
  db.query(sql, [eventId], (err, result) => {
    if (err) {
      console.error("Database error in hideFtdItem:", err);
      res.status(500).send({ error: err.message });
    } else {
      res.status(200).send({
        message: "해당상품을 메인화면 일반상품 레이아웃에서 제거하였습니다.",
      });
    }
  });
};


////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// 브랜드 - 메인디스플레이 main_display =1 불러오기 (사용자,관리자)
exports.getSelected_Brand = (req, res) => {
  const sql =
    "SELECT idx, brand_name_en, brand_name_ko, brand_discount, filename, main_display FROM brands WHERE main_display = 1 ORDER BY idx DESC;";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error in getSelectable_Ftd_items:", err);
      res.status(500).send({ error: err.message });
    } else {
      res.send(results);
    }
  });
};


// 브랜드 - 메인디스플레이 main_display 값이 0인 상품가져오기 & 페이징처리
exports.getSelectable_Brand = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const sql = `SELECT idx, brand_name_en, brand_name_ko, brand_discount, filename, main_display
               FROM brands
               WHERE main_display = 0
               ORDER BY idx DESC
               LIMIT ?, ?;`;

  const countSql = `SELECT COUNT(idx) AS totalItems FROM brands WHERE main_display = 0;`;

  db.query(countSql, (err, countResults) => {
    if (err) {
      console.error("Database error in getSelectableFtdItem count:", err);
      res.status(500).send({ error: err.message });
    } else {
      db.query(sql, [offset, limit], (err, results) => {
        if (err) {
          console.error("Database error in getSelectableFtdItem:", err);
          res.status(500).send({ error: err.message });
        } else {
          res.send({
            items: results,
            totalItems: countResults[0].totalItems,
            totalPages: Math.ceil(countResults[0].totalItems / limit),
            currentPage: page,
          });
        }
      });
    }
  });
};



// 브랜드를 메인 디스플레이에 추가(main_display 값을 1으로 변경)
exports.add_Brand = (req, res) => {
  const brandId = req.params.brandId;
  const sql = "UPDATE brands SET main_display = 1 WHERE idx = ?";
  db.query(sql, [brandId], (err, result) => {
    if (err) {
      console.error("Database error in addItemToDisplay:", err);
      res.status(500).send({ error: err.message });
    } else {
      res.status(200).send({
        message: "해당상품을 메인화면 강조상품 레이아웃에서 추가하였습니다.",
      });
    }
  });
};

// 브랜드를 메인 디스플레이에서 제거 (main_display 값을 0으로 변경)
exports.remove_Brand = (req, res) => {
  const brandId = req.params.brandId;
  const sql = "UPDATE brands SET main_display = 0 WHERE idx = ?";
  db.query(sql, [brandId], (err, result) => {
    if (err) {
      console.error("Database error in hideFtdItem:", err);
      res.status(500).send({ error: err.message });
    } else {
      res.status(200).send({
        message: "해당상품을 메인화면 강조상품 레이아웃에서 제거하였습니다.",
      });
    }
  });
};