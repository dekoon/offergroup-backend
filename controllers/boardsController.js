//controllers/boardsController.js
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

// 로직명
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

// 로직명
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


// 로직명
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


// 로직명
exports.todoList = (req, res) => {
    let sql = "SELECT * FROM boardtodoList ORDER BY idx DESC limit 0, 5";
  db.query(sql, (err, lists) => {
    if (err) {
      throw err;
    } else {
      res.send({
        lists,
      });
    }
  });
};

// 로직명
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

// 로직명
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

// 로직명
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

// 로직명
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

// 로직명
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


// 게시판 삭제
//11-21-commit, 생성되었던 table DROP이 용이하도록 boardIdx가 아닌 boardCode를 param으로 가져와 delete와 drop을 실행.
// 이전 코드에선 게시판 목록에선 지워졌지만 데이터베이스에 생성되었던 테이블은 남아있었음.

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


// 게시글 삭제
// 로직명
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


//리뷰 작성

// 다중게시판

//adminMain get Orders
exports.getNumOfOrders = (req, res) => {
  const date = new Date();

  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  const dateStr = year + "-" + month + "-" + day;

  console.log(dateStr);

  let sql = "SELECT COUNT(idx) AS cnt FROM orders WHERE DATE(orderTime)=?;";

  db.query(sql, dateStr, (err, recentOrders) => {
    if (err) {
      throw err;
    } else {
      res.send({
        recentOrders,
      });
    }
  });
};

// 로직명
exports.sample = (req, res) => {

};
