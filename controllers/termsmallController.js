// termsmallController.js
const db = require("../config/db");

exports.getAlltermsMall = (req, res) => {
  const sql = `SELECT * FROM terms_mall`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving company info");
      return;
    }
    res.send(result);
  });
};

exports.getTermsMall = async (req, res) => {
  try {
    const sql = "SELECT * FROM terms_mall";
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error fetching company info");
        return;
      }
      res.json(result[0]);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};


exports.createTermsMall = async (req, res) => {
  try {
    const {
      personal_info,
      service_use,
      company_intro,
    } = req.body;

    // 기존 정보가 있는지 확인
    const selectSql = `SELECT * FROM terms_mall`;
    db.query(selectSql, (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error checking company info");
        return;
      }

      // 기존 정보가 있으면 업데이트, 없으면 새로 생성
      let sql, values;
      if (rows.length > 0) {
        sql = `
          UPDATE terms_mall
          SET
            personal_info=?,
            service_use=?,
            company_intro=?
        `;
        values = [
          personal_info,
          service_use,
          company_intro
        ];
      } else {
        sql = `
          INSERT INTO terms_mall
            (personal_info, service_use, company_intro)
          VALUES (?, ?, ?)
        `;
        values = [
          personal_info,
          service_use,
          company_intro
        ];
      }

      db.query(sql, values, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error saving company info");
          return;
        }
        res.send("Company info saved successfully");
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
