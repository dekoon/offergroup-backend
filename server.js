//server.js
require("dotenv").config();

if (process.env.NODE_ENV === "production") {
  require("dotenv").config({ path: ".env.production" });
} else {
  require("dotenv").config({ path: ".env" });
}

const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const morgan = require("morgan");

const { savePgInfo } = require("./controllers/paymentController");
const paymentController = require("./controllers/paymentController");

const paymentWebhookRoutes = require("./routes/paymentWebhook");
const upload = require("./config/multerConfig");
const brandsRoutes = require("./routes/brandsRoutes");
const eventsRoutes = require("./routes/eventsRoutes");
const couponsRoutes = require("./routes/couponsRoutes");
const authRoutes = require("./routes/authRoutes");
const boardsRoutes = require("./routes/boardsRoutes");
const itemsRoutes = require("./routes/itemsRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const userinfoRoutes = require("./routes/userinfoRoutes");
const myorderRoutes = require("./routes/myorderRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const displaymanagerRoutes = require("./routes/displayManagerRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const recentRouters = require("./routes/recentRoutes");
const companyinfoRoutes = require("./routes/companyinfoRoutes");
const faqRoutes = require("./routes/faqRoutes");
const termsmallRoutes = require("./routes/termsmallRoutes");
const searchRoutes = require("./routes/searchRoutes");
const adminsRoutes = require("./routes/adminsRoutes");
const termsasRoutes = require("./routes/termsasRoutes");
//
//const { savePaymentDetails } = require("./controllers/pgpaymentcontroller");

//middleware
app.use(morgan("dev")); // morgan 사용 설정, 모든 요청 로그를 'dev' 포맷으로 출력
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static("uploads"));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/coupons", couponsRoutes);
app.use("/api/boards", boardsRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/userinfo", userinfoRoutes);
app.use("/api/myorder", myorderRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/display", displaymanagerRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/recent", recentRouters);
app.use("/api/notice", noticeRoutes);
app.use("/api/companyinfo", companyinfoRoutes);
app.use("/api/termsmall", termsmallRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/admin", adminsRoutes);
app.use("/api/termsas", termsasRoutes);
//
app.use("/api/webhook", paymentWebhookRoutes);

//
//
// TODO: 개발자센터에 로그인해서 내 결제위젯 연동 키 > 시크릿 키를 입력하세요. 시크릿 키는 외부에 공개되면 안돼요.
// @docs https://docs.tosspayments.com/reference/using-api/api-keys
const widgetSecretKey = "test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6";
const apiSecretKey = "test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R";

// 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
// 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
// @docs https://docs.tosspayments.com/reference/using-api/authorization#%EC%9D%B8%EC%A6%9D
const encryptedWidgetSecretKey =
  "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");
const encryptedApiSecretKey =
  "Basic " + Buffer.from(apiSecretKey + ":").toString("base64");

// 결제위젯 승인
app.post("/confirm/widget", async function (req, res) {
  const { paymentKey, orderId, amount } = req.body;

  try {
    // 결제 승인 API 호출
    const response = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: encryptedWidgetSecretKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, amount, paymentKey }),
      }
    );

    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      // 실패 응답 반환
      res.status(response.status).json(result);
      return;
    }

    // 성공 로직 추가
    // 결제 승인 후 DB에 저장 시작
    //await paymentController.saveMultiOrder(req, res, result);

    // ✅ 결제 승인 성공 응답
    res.status(200).json({
      message: "결제가 승인되었습니다.",
      data: result,
    });
  } catch (error) {
    console.error("결제 처리 중 오류 발생:", error.message);
    res.status(500).json({
      message: "결제 처리 중 문제가 발생했습니다.",
      error: error.message,
    });
  }
});

// 결제창 승인
app.post("/confirm/payment", function (req, res) {
  const { paymentKey, orderId, amount } = req.body;

  // 결제 승인 API를 호출하세요.
  // 결제를 승인하면 결제수단에서 금액이 차감돼요.
  // @docs https://docs.tosspayments.com/guides/v2/payment-widget/integration#3-결제-승인하기
  fetch("https://api.tosspayments.com/v1/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: encryptedApiSecretKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId: orderId,
      amount: amount,
      paymentKey: paymentKey,
    }),
  }).then(async function (response) {
    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      // TODO: 결제 승인 실패 비즈니스 로직을 구현하세요.
      res.status(response.status).json(result);

      return;
    }

    // TODO: 결제 완료 비즈니스 로직을 구현하세요.
    res.status(response.status).json(result);
  });
});

// 브랜드페이 승인
app.post("/confirm/brandpay", function (req, res) {
  const { paymentKey, orderId, amount, customerKey } = req.body;

  // 결제 승인 API를 호출하세요.
  // 결제를 승인하면 결제수단에서 금액이 차감돼요.
  // @docs https://docs.tosspayments.com/guides/v2/payment-widget/integration#3-결제-승인하기
  fetch("https://api.tosspayments.com/v1/brandpay/payments/confirm", {
    method: "POST",
    headers: {
      Authorization: encryptedApiSecretKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderId: orderId,
      amount: amount,
      paymentKey: paymentKey,
      customerKey: customerKey,
    }),
  }).then(async function (response) {
    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      // TODO: 결제 승인 실패 비즈니스 로직을 구현하세요.
      res.status(response.status).json(result);

      return;
    }

    // TODO: 결제 완료 비즈니스 로직을 구현하세요.
    res.status(response.status).json(result);
  });
});

// 브랜드페이 Access Token 발급
app.get("/callback-auth", function (req, res) {
  const { customerKey, code } = req.query;

  // 요청으로 받은 customerKey 와 요청한 주체가 동일인인지 검증 후 Access Token 발급 API 를 호출하세요.
  // @docs https://docs.tosspayments.com/reference/brandpay#access-token-발급
  fetch(
    "https://api.tosspayments.com/v1/brandpay/authorizations/access-token",
    {
      method: "POST",
      headers: {
        Authorization: encryptedApiSecretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grantType: "AuthorizationCode",
        customerKey,
        code,
      }),
    }
  ).then(async function (response) {
    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      // TODO: 발급 실패 비즈니스 로직을 구현하세요.
      res.status(response.status).json(result);

      return;
    }

    // TODO: 발급 성공 비즈니스 로직을 구현하세요.
    res.status(response.status).json(result);
  });
});

const billingKeyMap = new Map();

// 빌링키 발급
app.post("/issue-billing-key", function (req, res) {
  const { customerKey, authKey } = req.body;

  // AuthKey 로 카드 빌링키 발급 API 를 호출하세요
  // @docs https://docs.tosspayments.com/reference#authkey로-카드-빌링키-발급
  fetch(`https://api.tosspayments.com/v1/billing/authorizations/issue`, {
    method: "POST",
    headers: {
      Authorization: encryptedApiSecretKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerKey,
      authKey,
    }),
  }).then(async function (response) {
    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      // TODO: 빌링키 발급 실패 비즈니스 로직을 구현하세요.
      res.status(response.status).json(result);

      return;
    }

    // TODO: 빌링키 발급 성공 비즈니스 로직을 구현하세요.
    // TODO: 발급된 빌링키를 구매자 정보로 찾을 수 있도록 저장해두고, 결제가 필요한 시점에 조회하여 카드 자동결제 승인 API 를 호출합니다.
    billingKeyMap.set(customerKey, result.billingKey);
    res.status(response.status).json(result);
  });
});

// 카드 자동결제 승인
app.post("/confirm-billing", function (req, res) {
  const {
    customerKey,
    amount,
    orderId,
    orderName,
    customerEmail,
    customerName,
  } = req.body;

  // 저장해두었던 빌링키로 카드 자동결제 승인 API 를 호출하세요.
  fetch(
    `https://api.tosspayments.com/v1/billing/${billingKeyMap.get(customerKey)}`,
    {
      method: "POST",
      headers: {
        Authorization: encryptedApiSecretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerKey,
        amount,
        orderId,
        orderName,
        customerEmail,
        customerName,
      }),
    }
  ).then(async function (response) {
    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      // TODO: 자동결제 승인 실패 비즈니스 로직을 구현하세요.
      res.status(response.status).json(result);

      return;
    }

    // TODO: 자동결제 승인 성공 비즈니스 로직을 구현하세요.
    res.status(response.status).json(result);
  });
});
//
//
// port
const port = process.env.PORT || 4001;
app.listen(process.env.PORT, () => {
  const dir = "uploads";
  if (!fs.existsSync(dir)) {
    fs.mkdir(dir, (err) => {
      if (err) {
        throw err;
      }
    });
  }
  console.log("Server Running Port : " + process.env.PORT);
});
