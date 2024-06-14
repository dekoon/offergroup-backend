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
app.use("/api/dashboard", dashboardRoutes );
app.use("/api/recent", recentRouters);
app.use("/api/notice", noticeRoutes);
app.use("/api/companyinfo", companyinfoRoutes);
app.use("/api/termsmall", termsmallRoutes);
app.use("/api/search", searchRoutes);
//
app.use("/api/webhook", paymentWebhookRoutes);

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
