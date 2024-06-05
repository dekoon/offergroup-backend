//controllers/displayManagerController.js
const bcrypt = require("bcrypt");
const db = require("../config/db");
const upload = require("../config/multerConfig");
const saltRounds = 10;

// 1x1상품-메인디스플레이(사용자,관리자)
exports.getSelected_Ftd_items = (req, res) => {
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


// main_ftd_display 값이 0인 상품가져오기
exports.getSelectableFtdItem = (req, res) => {
  const sql =
    "SELECT idx, itemname, itemname_en, price, sale, attach, main_ftd_display, main_display_title, main_display_summary FROM item WHERE main_ftd_display = 0 ORDER BY idx DESC;";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error in getSelectableFtdItem:", err);
      res.status(500).send({ error: err.message });
    } else {
      res.send(results);
    }
  });
};

// 1x1 상품을 메인 디스플레이에 추가하는 컨트롤러(main_ftd_display 값을 1으로 변경)
exports.addItemToDisplay = (req, res) => {
  const itemId = req.params.itemId;
  const sql = "UPDATE item SET main_ftd_display = 1 WHERE idx = ?";
  db.query(sql, [itemId], (err, result) => {
    if (err) {
      console.error("Database error in addItemToDisplay:", err);
      res.status(500).send({ error: err.message });
    } else {
      res.status(200).send({ message: "상품이 성공적으로 추가되었습니다." });
    }
  });
};

// 1x1 상품을 메인 디스플레이에 제거하는 컨트롤러 (main_ftd_display 값을 0으로 변경)
exports.removeFtdItem = (req, res) => {
  const itemId = req.params.itemId;
  const sql = "UPDATE item SET main_ftd_display = 0 WHERE idx = ?";
  db.query(sql, [itemId], (err, result) => {
    if (err) {
      console.error("Database error in hideFtdItem:", err);
      res.status(500).send({ error: err.message });
    } else {
      res.status(200).send({ message: "상품이 성공적으로 숨겨졌습니다." });
    }
  });
};



exports.update_Main_display_Ftd_items = (req, res) => {
  const { main_ftd_display_Ftd_items } = req.body; // 이 배열은 선택된 이벤트의 idx 배열.
  db.beginTransaction((err) => {
    if (err) throw err;

    // 모든 상품을 'not main_ftd_display'로 설정
    db.query("UPDATE item SET main_ftd_display = false", (error, results) => {
      if (error) {
        return db.rollback(() => {
          throw error;
        });
      }

      // 선택된 상품만 'main_ftd_display'로 설정
      main_ftd_display_Ftd_items.forEach((idx) => {
        db.query(
          "UPDATE item SET main_ftd_display = true WHERE idx = ?",
          [idx],
          (err, results) => {
            if (err) {
              return db.rollback(() => {
                throw err;
              });
            }
          }
        );
      });

      db.commit((err) => {
        if (err) {
          return db.rollback(() => {
            throw err;
          });
        }
        res.send({
          status: 200,
          message: "선택된 항목으로 메인페이지에 디스플레이되었습니다.",
        });
      });
    });
  });
};



// 일반상품-메인디스플레이(메인화면불러오기)
exports.getSelected_Items = (req, res) => {
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


// 일반상품-관리자설정
exports.getSelectable_Items = (req, res) => {
  const sql =
    "SELECT idx, itemname, price, sale, attach, main_display FROM item ORDER BY (main_display = 1) DESC, idx DESC;";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error in getSelectable_Items:", err);
      res.status(500).send({ error: err.message });
    } else {
      res.send(results);
    }
  });
};

exports.update_Main_display_Items = (req, res) => {
  const { main_display_Items } = req.body; // 이 배열은 선택된 이벤트의 idx 배열.
  db.beginTransaction((err) => {
    if (err) throw err;

    // 모든 상품을 'not main_display'로 설정
    db.query("UPDATE item SET main_display = false", (error, results) => {
      if (error) {
        return db.rollback(() => {
          throw error;
        });
      }

      // 선택된 상품만 'main_display'로 설정
      main_display_Items.forEach((idx) => {
        db.query(
          "UPDATE item SET main_display = true WHERE idx = ?",
          [idx],
          (err, results) => {
            if (err) {
              return db.rollback(() => {
                throw err;
              });
            }
          }
        );
      });

      db.commit((err) => {
        if (err) {
          return db.rollback(() => {
            throw err;
          });
        }
        res.send({
          status: 200,
          message: "선택된 항목으로 메인페이지에 디스플레이되었습니다.",
        });
      });
    });
  });
};


// 이벤트-메인디스플레이
exports.getSelectable_Events = (req, res) => {
  const sql =
    "SELECT idx, event_title, event_desc, filename, main_display FROM events ORDER BY idx DESC;";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error in getSelectable_Events:", err);
      res.status(500).send({ error: err.message });
    } else {
      res.send(results);
    }
  });
};

exports.update_Main_display_Events = (req, res) => {
  const { main_display_Events } = req.body; // 이 배열은 선택된 이벤트의 idx 배열.
  db.beginTransaction((err) => {
    if (err) throw err;

    // 모든 이벤트을 'not main_display'로 설정
    db.query("UPDATE events SET main_display = false", (error, results) => {
      if (error) {
        return db.rollback(() => {
          throw error;
        });
      }

      // 선택된 이벤트만 'main_display'로 설정
      main_display_Events.forEach((idx) => {
        db.query(
          "UPDATE events SET main_display = true WHERE idx = ?",
          [idx],
          (err, results) => {
            if (err) {
              return db.rollback(() => {
                throw err;
              });
            }
          }
        );
      });

      db.commit((err) => {
        if (err) {
          return db.rollback(() => {
            throw err;
          });
        }
        res.send({
          status: 200,
          message: "선택된 항목으로 메인페이지에 디스플레이되었습니다.",
        });
      });
    });
  });
};


// 브랜드-메인디스플레이
exports.getSelectable_Brands = (req, res) => {
  const sql =
    "SELECT idx, brand_name_en, brand_name_ko, brand_discount, filename, main_display FROM brands ORDER BY idx DESC;";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error in getSelectable_Brands:", err);
      res.status(500).send({ error: err.message });
    } else {
      res.send(results);
    }
  });
};

exports.update_Main_display_Brands = (req, res) => {
  const { main_display_Brands } = req.body; // 이 배열은 선택된 브랜드의 idx 배열.
  db.beginTransaction((err) => {
    if (err) throw err;

    // 모든 브랜드을 'not main_display'로 설정
    db.query("UPDATE brands SET main_display = false", (error, results) => {
      if (error) {
        return db.rollback(() => {
          throw error;
        });
      }

      // 선택된 브랜드만 'main_display'로 설정
      main_display_Brands.forEach((idx) => {
        db.query(
          "UPDATE brands SET main_display = true WHERE idx = ?",
          [idx],
          (err, results) => {
            if (err) {
              return db.rollback(() => {
                throw err;
              });
            }
          }
        );
      });

      db.commit((err) => {
        if (err) {
          return db.rollback(() => {
            throw err;
          });
        }
        res.send({
          status: 200,
          message: "선택된 항목으로 메인페이지에 디스플레이되었습니다.",
        });
      });
    });
  });
};


// 쿠폰-메인디스플레이
exports.getSelectable_Coupons = (req, res) => {
  const sql =
    "SELECT idx, coupon_title, coupon_state, filename, main_display FROM coupons ORDER BY idx DESC;";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Database error in getSelectable_Coupons:", err);
      res.status(500).send({ error: err.message });
    } else {
      res.send(results);
    }
  });
};

exports.update_Main_display_Coupons = (req, res) => {
  const { main_display_Coupons } = req.body; // 이 배열은 선택된 쿠폰의 idx 배열.
  db.beginTransaction((err) => {
    if (err) throw err;

    // 모든 쿠폰을 'not main_display'로 설정
    db.query("UPDATE coupons SET main_display = false", (error, results) => {
      if (error) {
        return db.rollback(() => {
          throw error;
        });
      }

      // 선택된 쿠폰만 'main_display'로 설정
      main_display_Coupons.forEach((idx) => {
        db.query(
          "UPDATE coupons SET main_display = true WHERE idx = ?",
          [idx],
          (err, results) => {
            if (err) {
              return db.rollback(() => {
                throw err;
              });
            }
          }
        );
      });

      db.commit((err) => {
        if (err) {
          return db.rollback(() => {
            throw err;
          });
        }
        res.send({
          status: 200,
          message: "선택된 항목으로 메인페이지에 디스플레이되었습니다.",
        });
      });
    });
  });
};
