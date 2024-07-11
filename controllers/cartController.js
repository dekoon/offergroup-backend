//controllers/cartController.js
const bcrypt = require("bcrypt");
const db = require("../config/db");
const saltRounds = 10;

// 장바구니에 상품 추가(결제 유형에 따른 분류 추가)
exports.addToCart = (req, res) => {
    const {userId, idx} = req.params;
    const {
        counter,
        price,
        selectedMonth,
        monthlyPayment,
        TotalPayment,
        paymentType
    } = req.body;

    let sql = "INSERT INTO cart(userId, itemIdx, itemCounter, itemPrice, selectedMonth, monthlyPayment, TotalPayment, paymentType) VALUES(?, ?, ?, ?, ?, ?, ?, ?);";

    db.query(sql, [
        userId,
        idx,
        counter,
        price,
        selectedMonth,
        monthlyPayment,
        TotalPayment,
        paymentType
    ], (err) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .send({message: "장바구니 추가 중 오류가 발생했습니다."});
        } else {
            res.send({status: 201, message: "장바구니에 넣었습니다.", paymentType});
        }
    });
};

// 특정 사용자의 장바구니 목록 조회
exports.getCart = (req, res) => {
    const {userId} = req.params;
    let userSQL = "SELECT * FROM user WHERE id=?;";
    db.query(userSQL, [userId], (err, user) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .send({message: "사용자 조회 중 오류가 발생했습니다."});
        } else {
            let cartSQL = "SELECT cart.*, item.itemname, item.attach FROM cart JOIN item ON cart.itemIdx " +
                    "= item.idx WHERE cart.userId=?;";
            db.query(cartSQL, [userId], (err, result) => {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .send({message: "장바구니 조회 중 오류가 발생했습니다."});
                }
                res.send({user, result});
            });
        }
    });
};

// 장바구니에서 상품 제거
exports.removeItem = (req, res) => {
    let sql = "DELETE FROM cart WHERE idx=?;";
    db.query(sql, [req.params.idx], (err) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .send({message: "상품 제거 중 오류가 발생했습니다."});
        }
        res.send({status: 201, message: "장바구니에서 상품을 제거하였습니다."});
    });
};

// 선택한 아이템 삭제
exports.removeSelectedItems = (req, res) => {
    const {userId, items} = req.body;
    let sql = "DELETE FROM cart WHERE userId=? AND idx IN (?);";
    db.query(sql, [
        userId, [items]
    ], (err, result) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .send({message: "선택한 상품 제거 중 오류가 발생했습니다."});
        }
        res.send({status: 201, message: "선택한 상품을 제거하였습니다."});
    });
};

// 장바구니 비우기
exports.removeAllItems = (req, res) => {
    let sql = "DELETE FROM cart WHERE userId=?;";
    db.query(sql, [req.params.userId], (err) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .send({message: "장바구니 비우기 중 오류가 발생했습니다."});
        }
        res.send({status: 201, message: "장바구니를 비웠습니다."});
    });
};

//특정 사용자의 장바구니 아이템 개수 조회
exports.getCartItemCount = (req, res) => {
    const {userId} = req.params;
    let sql = "SELECT COUNT(*) AS itemCount FROM cart WHERE userId=?;";
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res
                .status(500)
                .send({message: "장바구니 아이템 개수 조회 중 오류가 발생했습니다."});
        } else {
            const itemCount = results[0].itemCount;
            res.send({status: 200, itemCount: itemCount});
        }
    });
};
