//controllers/eventsController.js
const bcrypt = require("bcrypt");
const db = require("../config/db");
const upload = require("../config/multerConfig");
const saltRounds = 10;

// 사용자 이벤트 목록가져오기
exports.getAllEvents = (req, res) => {
  let sql = "SELECT * FROM events;";
  db.query(sql, (err, events) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
    } else {
      res.send(events);
    }
  });
};

// 관리자/사용자 이벤트 목록보이기
exports.eventsManager = (req, res) => {
  // page와 offset에 대한 기본값 설정
  const page = parseInt(req.query.page) || 1; // 파라미터가 제공되지 않을 경우를 대비
  const offset = parseInt(req.query.offset) || 10; // 파라미터가 제공되지 않을 경우를 대비
  const startNum = (page - 1) * offset;

  let whereClause = "";
  const searchQuery = req.query.searchQuery;
  const select = req.query.select;

  if (searchQuery) {
    if (select === "event_title" || select === "event_desc") {
      whereClause = `WHERE ${select} LIKE '%${searchQuery}%'`;
    } else if (select === "" || select === "all") {
      // "전체" 옵션이 선택되었을 경우
      whereClause = `WHERE event_title LIKE '%${searchQuery}%' OR event_desc LIKE '%${searchQuery}%'`;
    }
  }

  let sql = `SELECT count(idx) AS cnt FROM events ${whereClause};`;
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
      return;
    }
    let listSQL = `SELECT * FROM events ${whereClause} ORDER BY idx DESC LIMIT ?, ?;`;
    db.query(listSQL, [startNum, offset], (err, events) => {
      if (err) {
        console.error(err);
        res.status(500).send({ error: err.message });
        return;
      }
      res.send({
        events,
        page,
        totalRows: result[0].cnt,
        totalPageNum: Math.ceil(result[0].cnt / offset),
      });
    });
  });
};

// 이벤트 등록
exports.addEvent = (req, res) => {
  const {
    event_title,
    event_desc,
    event_start,
    event_end,
    related_items,
  } = req.body;
  const filename =
    req.files.attach && req.files.attach.length > 0
      ? req.files.attach[0].filename
      : null;

  let sql = `INSERT INTO events (event_title, event_desc, filename, event_start, event_end, related_items, created_at, regdated_at)
             VALUES (?, ?, ?, ?, ?, ?, now(), now());`;

  let queryValues = [
    event_title,
    event_desc,
    filename,
    event_start,
    event_end,
    related_items,
  ];

  db.query(sql, queryValues, (err) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .send({ status: 500, message: "서버에러발생, 이벤트 등록 실패" });
    } else {
      res.send({ status: 201, message: "이벤트 등록이 완료되었습니다!" });
    }
  });
};

// 이벤트 삭제
exports.deleteEvent = (req, res) => {
  let sql = "DELETE FROM events WHERE idx=?;";
  db.query(sql, [req.params.idx], (err) => {
    if (err) {
      res.status(500).send("Failed to delete the event");
      return;
    }
    res.send({ status: 201, message: "이벤트가 삭제되었습니다." });
  });
};

// 이미지 삭제 기능
exports.deleteImage = (req, res) => {
  const { idx } = req.params;

  // 먼저 데이터베이스에서 해당 이벤트의 정보를 조회
  db.query(
    "SELECT filename FROM events WHERE idx = ?",
    [idx],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ error: err.message });
      }

      if (
        results.length > 0 &&
        results[0].filename &&
        results[0].filename !== null
      ) {
        const filePath = `./uploads/events/${results[0].filename}`;

        // 파일 시스템에서 파일 삭제
        const fs = require("fs");
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send({ error: "Failed to delete the file" });
          }

          // 파일 삭제 성공 후, 데이터베이스에서 파일명 업데이트
          db.query(
            "UPDATE events SET filename = NULL WHERE idx = ?",
            [idx],
            (err) => {
              if (err) {
                console.error(err);
                return res
                  .status(500)
                  .send({ error: "Database update failed" });
              }
              res.send({ status: 200, message: "이미지가 삭제되었습니다." });
            }
          );
        });
      } else {
        res.status(404).send({ error: "No file to delete or already deleted" });
      }
    }
  );
};

// 이벤트 한개 불러오기 (수정 페이지용)
exports.updateEventForm = (req, res) => {
  const { idx } = req.params;
  let sql = "SELECT * FROM events WHERE idx = ?;";
  db.query(sql, [req.params.idx], (err, response) => {
    if (err) {
      res.status(500).send("데이터베이스 쿼리 오류");
      return;
    }
    res.send(response);
  });
};

// 이벤트 수정
exports.updateEvent = (req, res) => {
  const { idx } = req.params;
  const { event_title, event_desc, event_start, event_end, related_items } =
    req.body;
  let updates = [];
  let values = [];

  if (event_title) {
    updates.push("event_title = ?");
    values.push(event_title);
  }
  if (event_desc) {
    updates.push("event_desc = ?");
    values.push(event_desc);
  }
  if (req.file && req.file.filename) {
    updates.push("filename = ?");
    values.push(req.file.filename);
  }
  if (event_start) {
    updates.push("event_start = ?");
    values.push(event_start);
  }
  if (event_end) {
    updates.push("event_end = ?");
    values.push(event_end);
  }
   if (related_items) {
     updates.push("related_items = ?");
     values.push(related_items);
   }

  updates.push("regdated_at = now()");

  let sql = `UPDATE events SET ${updates.join(", ")} WHERE idx = ?;`;
  values.push(req.params.idx);

  db.query(sql, values, (err) => {
    if (err) {
      console.error(err);
      res
        .status(500)
        .send({ status: 500, message: "서버에러발생, 이벤트 수정 실패" });
    } else {
      console.log("update complete");
      res.send({ status: 201, message: "이벤트 수정 완료" });
    }
  });
};

// 이벤트 상세보기
exports.detailEvent = (req, res) => {
  const { idx } = req.params;
  let sql = "SELECT * FROM events WHERE idx = ?;";
  db.query(sql, [req.params.idx], (err, results) => {
    if (err) {
      res.status(500).send("Database query error");
      return;
    }
    console.log(results); // 데이터 구조 확인을 위한 로그
    res.send(results[0]); // 첫 번째 결과만 반환하도록 변경
  });
};