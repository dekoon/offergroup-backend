//controllers/boardPostController.js
const bcrypt = require("bcrypt");
const db = require("../config/db");
const saltRounds = 10;

// 게시글 목록 조회
exports.boardGet = (req, res) => {
    const boardCode = req.query.boardCode;
  const page = Number.parseInt(req.query.page);
  const offset = Number.parseInt(req.query.offset);
  const startNum = (page - 1) * offset;
  const select = req.query.select || "";
  const search = req.query.searchQuery || "";
  const idxSearch = "%" + search + "%";
  const titleSearch = "%" + search + "%";
  const writerSearch = "%" + search + "%";

  let sql =
    "SELECT COUNT(idx) AS cnt FROM board" +
    boardCode +
    " WHERE idx LIKE ? OR title LIKE ?  OR writer LIKE ?;";
  db.query(sql, [idxSearch, titleSearch, writerSearch], (err, result) => {
    if (err) {
      throw err;
    } else {
      let listSQL =
        "SELECT * FROM board" +
        boardCode +
        " WHERE idx LIKE ? OR title LIKE ?  OR writer LIKE ? ORDER BY idx DESC LIMIT ?, ?;";
      db.query(
        listSQL,
        [idxSearch, titleSearch, writerSearch, startNum, offset],
        (err, lists) => {
          if (err) {
            throw err;
          } else {
            res.send({
              lists,
              page,
              totalRows: result[0].cnt,
              totalPageNum: Math.ceil(result[0].cnt / offset),
            });
          }
        }
      );
    }
  });
};

// 게시글 작성
exports.write = (req, res) => {
   const { title, writer, passwd, contents } = req.body;
  const { filename } = req.file || "";

  let sql =
    "insert into board" +
    req.query.boardCode +
    " values(null, ?, ?, ?, ?, ?, 0, now());";
  db.query(sql, [title, writer, passwd, contents, filename], (err) => {
    if (err) {
      throw err;
    } else {
      console.log("write complete");
      res.send({ status: 201, message: "게시글 등록 완료" });
    }
  });
};

// 게시글 조회(상세보기)
exports.view = (req, res) => {
    const { boardCode, idx } = req.query;
  let viewSQL =
    "update board" + boardCode + " set view=(view+1) where idx = ?;";
  db.query(viewSQL, [idx], (err) => {
    if (err) {
      throw err;
    } else {
      let sql = "select * from board" + boardCode + " where idx = ? ;";
      db.query(sql, [idx], (err, result) => {
        if (err) {
          throw err;
        } else {
          res.send(result);
        }
      });
    }
  });
};

// 게시글 수정
exports.update = (req, res) => {
    // console.log(req.body);
  // console.log(req.file);
  const { title, writer, passwd, contents } = req.body;
  const { filename } = req.file || "";

  let sql =
    "update board" +
    req.query.boardCode +
    " set title=?, writer=?, passwd=?, contents=?, image=? where idx = ?";
  db.query(
    sql,
    [title, writer, passwd, contents, filename, req.query.idx],
    (err) => {
      if (err) {
        throw err;
      } else {
        console.log("update complete");
        res.send({ status: 201, message: "게시글 수정 완료" });
      }
    }
  );
};

// 이미지 삭제
exports.delImg = (req, res) => {
    const { boardCode, idx } = req.query;
  db.query(
    "SELECT image FROM board" + boardCode + " WHERE idx = ?;",
    [idx],
    (err, img) => {
      if (err) {
        throw err;
      } else {
        db.query("update board" + boardCode + " set image=NULL;");
        fs.unlink("./uploads/" + img[0].image, (err) => {
          if (err) throw err;
          res.send({ status: 201, message: "첨부파일 삭제 완료" });
        });
      }
    }
  );
};




// 게시글 삭제
exports.deletePost = (req, res) => {
      const { boardCode, idx } = req.params;

  db.query(
    "SELECT image FROM board" + boardCode + " WHERE idx = ?;",
    [idx],
    (err, img) => {
      if (err) {
        throw err;
      } else {
        let sql = "DELETE FROM board" + boardCode + " WHERE idx = ?;";
        db.query(sql, [idx], (err) => {
          if (err) {
            throw err;
          } else {
            fs.unlink("./uploads/" + img[0].image, (err) => {
              if (err) throw err;
            });
            res.send({ status: 201, message: "게시글 삭제 완료" });
          }
        });
      }
    }
  );
};