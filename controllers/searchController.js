//controllers/searchController.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");


// 관리자/사용자페이지 상품목록
exports.searchManager = (req, res, tableName) => {
  const page = parseInt(req.query.page, 10) || 1;
  const offset = parseInt(req.query.offset, 10) || 10;
  const startNum = (page - 1) * offset;
  const searchType = req.query.searchType;
  const searchQuery = req.query.searchQuery;

  let whereClause = " WHERE 1=1";
  let queryParams = [];

  // Item 테이블에 대한 검색 조건 설정
  if (tableName === "item") {
    switch (searchType) {
      case "itembrand":
        whereClause += " AND (itembrand LIKE ? OR itembrand_en LIKE ?)";
        queryParams.push(`%${searchQuery}%`, `%${searchQuery}%`);
        break;
      case "itemCode":
        whereClause += " AND itemCode LIKE ?";
        queryParams.push(`%${searchQuery}%`);
        break;
      case "itemname":
        whereClause += " AND (itemname LIKE ? OR itemname_en LIKE ?)";
        queryParams.push(`%${searchQuery}%`, `%${searchQuery}%`);
        break;
    }
  }
  // Orders 테이블에 대한 검색 조건 설정
  else if (tableName === "orders") {
    switch (searchType) {
      case "orderNum":
        whereClause += " AND orderNum LIKE ?";
        queryParams.push(`%${searchQuery}%`);
        break;
      case "userId":
        whereClause += " AND (userId LIKE ? OR username LIKE ?)";
        queryParams.push(`%${searchQuery}%`, `%${searchQuery}%`);
        break;
      case "orderedItem":
        whereClause += " AND orderedItem LIKE ?";
        queryParams.push(`%${searchQuery}%`);
        break;
    }
  }
  //countSQL:전체 데이터 수 계산
  let countSQL = `SELECT count(idx) AS cnt FROM ${tableName}${whereClause};`;
  db.query(countSQL, queryParams, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: "Database query error" });
    }
    const totalRows = data[0].cnt;
    const totalPageNum = Math.ceil(totalRows / offset);

    //listSQL: 페이지 계산 출력
    let listSQL = `SELECT * FROM ${tableName}${whereClause} ORDER BY idx DESC LIMIT ?, ?;`;
    queryParams.push(startNum, offset);

    db.query(listSQL, queryParams, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: "Database query error" });
      }
      // 조건에 따라 응답 키를 다르게 설정
      if (tableName === "item") {
        res.send({
          items: result,
          page,
          totalRows,
          totalPageNum,
        });
      } else if (tableName === "orders") {
        res.send({
          orders: result,
          page,
          totalRows,
          totalPageNum,
        });
      }
    });
  });
};