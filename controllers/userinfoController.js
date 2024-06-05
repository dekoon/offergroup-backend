// controllers/userinfoController.js

const bcrypt = require("bcrypt");
const db = require("../config/db");
const saltRounds = 10;


// 관리자:사용자목록가져오기
exports.getAllUser = (req, res) => {
  let sql = "SELECT * FROM user;";
  db.query(sql, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
    } else {
      res.send(user);
    }
  });
};



// 관리자:사용자목록가져오기
exports.userManager = (req, res) => {

};




// 사용자 정보 조회
exports.getUserInfo = (req, res) => {
  const userId = req.params.userId;

  // 데이터베이스에서 사용자 정보 조회
  const query = `SELECT * FROM user WHERE id = ?`; // "user" 테이블로 수정
  db.query(query, [userId], (err, userInfo) => {
    if (err) {
      console.error("Error fetching user info:", err);
      return res
        .status(500)
        .json({ message: "사용자 정보를 가져오는 중에 오류가 발생했습니다." });
    }
    if (userInfo.length > 0) {
      res.status(200).json(userInfo[0]);
    } else {
      res.status(404).json({ message: "사용자 정보를 찾을 수 없습니다." });
    }
  });
};
//

// 사용자 정보 수정
exports.updateUserInfo = (req, res) => {
  const userId = req.params.userId;
  const updatedUserInfo = req.body; // 업데이트된 사용자 정보

  // 데이터베이스에서 해당 사용자의 정보를 업데이트
  const query = `UPDATE user SET ? WHERE id = ?`;
  db.query(query, [updatedUserInfo, userId], (err, result) => {
    if (err) {
      console.error("Error updating user info:", err);
      return res.status(500).json({ message: "사용자 정보를 업데이트하는 중에 오류가 발생했습니다." });
    }
    res.status(200).json({ message: "사용자 정보가 성공적으로 업데이트되었습니다." });
  });
};
