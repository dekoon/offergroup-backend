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

exports.createPersonalInfo = async (req, res) => {
  try {
    const { personal_info } = req.body;
    const selectSql = `SELECT personal_info FROM terms_mall`;
    db.query(selectSql, async (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error checking personal info");
      }

      let sql;
      if (rows.length > 0) {
        sql = `UPDATE terms_mall SET personal_info=?`;
      } else {
        sql = `INSERT INTO terms_mall (personal_info) VALUES (?)`;
      }

      db.query(sql, [personal_info], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error saving personal info");
        }
        res.send("Personal info saved successfully");
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

//
exports.createServiceUse = async (req, res) => {
  try {
    const { service_use } = req.body;
    const selectSql = `SELECT service_use FROM terms_mall`;
    db.query(selectSql, async (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error checking service use");
      }

      let sql;
      if (rows.length > 0) {
        sql = `UPDATE terms_mall SET service_use=?`;
      } else {
        sql = `INSERT INTO terms_mall (service_use) VALUES (?)`;
      }

      db.query(sql, [service_use], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error saving service use");
        }
        res.send("Service use saved successfully");
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};


//
exports.createCompanyIntro = async (req, res) => {
  try {
    const { company_intro } = req.body;
    const selectSql = `SELECT company_intro FROM terms_mall`;
    db.query(selectSql, async (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error checking company intro");
      }

      let sql;
      if (rows.length > 0) {
        sql = `UPDATE terms_mall SET company_intro=?`;
      } else {
        sql = `INSERT INTO terms_mall (company_intro) VALUES (?)`;
      }

      db.query(sql, [company_intro], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error saving company intro");
        }
        res.send("Company intro saved successfully");
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};
