//controllers/boardManagerController.js
const bcrypt = require("bcrypt");
const db = require("../config/db");
const saltRounds = 10;

// 다중게시판
exports.boardlist = (req, res) => {
  console.log(req.query);
  const page = Number.parseInt(req.query.page);
  const offset = Number.parseInt(req.query.offset);
  const startNum = (page - 1) * offset;
  const select = req.query.select || "";
  const search = req.query.searchQuery || "";
  const codeSearch = "%" + search + "%";
  const nameSearch = "%" + search + "%";
  const categorySearch = "%" + search + "%";

  // db 1 : 전체 개시물 수
  // let sql = "SELECT COUNT(boardIdx) AS cnt FROM boardManager WHERE ? LIKE ?;";
  // db.query(sql, [select, search], (err, result) => {
  let sql =
    "SELECT COUNT(boardIdx) AS cnt FROM boardManager WHERE boardCode LIKE ? OR boardName LIKE ?  OR boardCategory LIKE ?;";
  db.query(sql, [codeSearch, nameSearch, categorySearch], (err, result) => {
    if (err) {
      throw err;
    } else {
      // db 2 : 페이징 처리를 위한 쿼리 AND 검색 쿼리
      let listSQL =
        "SELECT * FROM boardManager WHERE boardCode LIKE ? OR boardName LIKE ? OR boardCategory LIKE ? ORDER BY boardIdx ASC LIMIT ?, ?;";
      db.query(
        listSQL,
        [codeSearch, nameSearch, categorySearch, startNum, offset],
        (err, lists) => {
          if (err) {
            throw err;
          } else {
            res.send({
              lists,
              page, // 현재 페이지
              totalRows: result[0].cnt, // 전체 게시판 수
              totalPageNum: Math.ceil(result[0].cnt / offset), // 전체 페이지 수
            });
          }
        }
      );
    }
  });
};


// 게시판 추가
exports.boardAdd = (req, res) => {
 const {
    boardCode,
    boardCategory,
    boardName,
    boardBuilder,
    boardReadAllow,
    boardWriteAllow,
    boardCommentAllow,
    boardModifyAllow,
  } = req.body;
  let sql =
    "INSERT INTO boardManager VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?, now(), now());";
  db.query(
    sql,
    [
      boardCode,
      boardCategory,
      boardName,
      boardBuilder,
      boardReadAllow,
      boardWriteAllow,
      boardCommentAllow,
      boardModifyAllow,
    ],
    (err) => {
      if (err) {
        throw err;
      } else {
        //IF NOT EXISTS 삽입하여 테이블명 중첩될 때 덮어쓰는 거로 임시방편. 추후 if문을 통해(테이블명이 같은게 있을 시 경고창) 수정,
        // boardName 이 아닌 boardCode로 테이블 생성
        let createSQL = "CREATE TABLE IF NOT EXISTS board" + boardCode + "(";
        createSQL += "idx int auto_increment primary key,";
        createSQL += "title varchar(100),";
        createSQL += "writer varchar(50),";
        createSQL += "passwd varchar(255),";
        createSQL += "contents text,";
        createSQL += "image varchar(255),";
        createSQL += "view int default 0,";
        createSQL += "regdate date";
        createSQL += ");";
        db.query(createSQL, (err) => {
          if (err) {
            throw err;
          } else {
            console.log("board" + boardName + " Create Completed.");
          }
        });
        res.send({ status: 201, message: "게시판 생성 완료" });
      }
    }
  );
};

// 게시판 정보 조회
exports.boardUpdateGet = (req, res) => {
     // console.log(req.query);
  let sql = "select * from boardManager where boardCode=?;";
  db.query(sql, [req.query.boardCode], (err, result) => {
    if (err) {
      throw err;
    } else {
      res.send(result);
    }
  });
};



// 게시판 정보 수정
exports.boardUpdatePut = (req, res) => {
   const {
    boardCode,
    boardCategory,
    boardName,
    boardBuilder,
    boardReadAllow,
    boardWriteAllow,
    boardCommentAllow,
    boardModifyAllow,
    boardIdx,
  } = req.body;

  let sql =
    "update boardManager set boardCode=?, boardCategory=?, boardName=?, boardBuilder=?, boardReadAllow=?, boardWriteAllow=?, boardCommentAllow=?, boardModifyAllow=?, modifyDate=now() where boardIdx = ?";
  db.query(
    sql,
    [
      boardCode,
      boardCategory,
      boardName,
      boardBuilder,
      boardReadAllow,
      boardWriteAllow,
      boardCommentAllow,
      boardModifyAllow,
      boardIdx,
    ],
    (err) => {
      if (err) {
        throw err;
      } else {
        if (req.query.boardCode !== boardCode) {
          renameSQL =
            "rename table board" +
            req.query.boardCode +
            " to board" +
            boardCode +
            " ;";
          db.query(renameSQL, (err) => {
            if (err) throw err;
          });
        }
        console.log("update complete");
        res.send({ status: 201, message: "게시판 수정 완료" });
      }
    }
  );
};


// 게시판 삭제

exports.deleteBoard = (req, res) => {
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
