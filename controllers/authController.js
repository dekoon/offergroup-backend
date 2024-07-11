//controllers/authController.js
const bcrypt = require("bcrypt");
const db = require("../config/db");
const saltRounds = 10;

// 회원가입
exports.register = (req, res) => {
  const id = req.body.id;
  const pw = req.body.pw;
  const username = req.body.username;
  const email = req.body.email;
  const phone = req.body.phone;
  const zip = req.body.zip;
  const address = req.body.address;
  const detailAddress = req.body.detailAddress;

  let sql =
    "INSERT INTO user VALUES(NULL,?,?,?,?,?,?,?,'일반회원',now());";
  bcrypt.hash(req.body.pw, saltRounds, (err, hash_pw) => {
    db.query(
      sql,
      [
        id,
        hash_pw,
        username,
        email,
        phone,
        zip,
        address + detailAddress,
      ],
      (err) => {
        if (err) {
          throw err;
        }

        res.send({
          status: 201,
          message: "회원가입 완료!",
        });
      }
    );
  });
};

//아이디중복체크
exports.checkIdDuplication = (req, res) => {
  const id = req.body.id;

  let sql = "SELECT * FROM user WHERE id =?;";
  db.query(sql, [id], (err, id) => {
    if (err) throw err;

    if (id[0] === undefined) {
      res.send({
        status: 201,
      });
    } else {
      res.send({
        status: 400,
      });
    }
  });
};

// 로그인

exports.login = (req, res) => {
  const { id } = req.body;
  const { pw } = req.body;

  let sql = "SELECT * FROM user WHERE id=?;";
  db.query(sql, [req.body.id], (err, user) => {
    if (user[0] === undefined) {
      res.send({
        status: 404,
        message: "아이디를 확인해주세요.",
      });
    } else {
      bcrypt.compare(req.body.pw, user[0].pw, (err, result) => {
        if (result) {
          res.send({
            status: 201,
            message: user[0].id + "님 환영합니다",
            token: user[0].pw,
            id: user[0].id,
          });
        } else {
          res.send({
            status: 400,
            message: "비밀번호를 다시 확인해주세요.",
          });
        }
      });
    }
  });
};
// 회원정보불러오기
exports.getMyPage = (req, res) => {
  const userId = req.params.userId;
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

//회원정보수정
exports.editMyPage = (req, res) => {
  const userId = req.params.userId;
  const { username, email, phone, zip, address } = req.body;
  // 필요한 경우 더 많은 필드를 추가할 수 있습니다.

  let sql =
    "UPDATE user SET username = ?, email = ?, phone = ?, zip = ?, address = ? WHERE id = ?";

  db.query(
    sql,
    [username, email, phone, zip, address, userId],
    (err, result) => {
      if (err) {
        console.error("Error updating user info:", err);
        return res.status(500).send("회원 정보 수정 중 오류가 발생했습니다.");
      }
      res.send("회원 정보가 수정되었습니다.");
    }
  );
};

// 비밀번호 변경
exports.changePassword = (req, res) => {
  const userId = req.params.userId;
  const { currentPassword, newPassword } = req.body;

  console.log("Requested user ID:", userId); // 로그 추가

  const sql = "SELECT pw FROM user WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).send("서버 오류 발생.");
    }

    console.log("Database results:", results); // 로그 추가

    if (results.length > 0) {
      const hash = results[0].pw;
      bcrypt.compare(currentPassword, hash, (err, isMatch) => {
        if (err) {
          console.error("Bcrypt comparison error:", err);
          return res.status(500).send("비밀번호 검증 중 오류 발생.");
        }

        if (isMatch) {
          const newHash = bcrypt.hashSync(newPassword, saltRounds);
          const updateSql = "UPDATE user SET pw = ? WHERE id = ?";
          db.query(updateSql, [newHash, userId], (err, result) => {
            if (err) {
              console.error("Error updating password:", err);
              return res
                .status(500)
                .send("비밀번호 변경 중 오류가 발생했습니다.");
            }
            res.send({ status: 200, message: "비밀번호가 변경되었습니다." });
          });
        } else {
          res.status(400).send("현재 비밀번호가 일치하지 않습니다.");
        }
      });
    } else {
      res.status(404).send("사용자를 찾을 수 없습니다.");
    }
  });
};
