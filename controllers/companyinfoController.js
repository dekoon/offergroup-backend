// companyinfoController.js
const db = require("../config/db");


exports.getAllCompanyInfo = (req, res) => {
  const sql = `SELECT * FROM company_info`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving company info");
      return;
    }
    res.send(result); // 모든 회사 정보를 반환
  });
};

exports.getCompanyinfo = async (req, res) => {
  try {
    const sql = "SELECT * FROM company_info";
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error fetching company info");
        return;
      }
      res.json(result[0]); // 첫 번째 행만 반환 (회사 정보는 하나의 행으로 가정)
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};


exports.createCompanyinfo = async (req, res) => {
  try {
    const {
      Co_name,
      Co_phone,
      Co_email,
      Co_address,
      ceo_name,
      Co_fax,
      DPO_name,
      DPO_contact,
      Biz_License,
      onlineSeller_Num,
      Biz_day,
    } = req.body;

    // 기존 정보가 있는지 확인
    const selectSql = `SELECT * FROM company_info`;
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
          UPDATE company_info
          SET
            Co_phone=?,
            Co_email=?,
            Co_address=?,
            ceo_name=?,
            Co_fax=?,
            DPO_name=?,
            DPO_contact=?,
            Biz_License=?,
            onlineSeller_Num=?,
            Biz_day=?
        `;
        values = [
          Co_phone,
          Co_email,
          Co_address,
          ceo_name,
          Co_fax,
          DPO_name,
          DPO_contact,
          Biz_License,
          onlineSeller_Num,
          Biz_day,
        ];
      } else {
        sql = `
          INSERT INTO company_info
            (Co_name, Co_phone, Co_email, Co_address, ceo_name, Co_fax, DPO_name, DPO_contact, Biz_License, onlineSeller_Num, Biz_day)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        values = [
          Co_name,
          Co_phone,
          Co_email,
          Co_address,
          ceo_name,
          Co_fax,
          DPO_name,
          DPO_contact,
          Biz_License,
          onlineSeller_Num,
          Biz_day,
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
