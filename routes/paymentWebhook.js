// routes/paymentWebhook.js
const express = require("express");
const router = express.Router();

// Node.js 17.5 이상에서 내장된 fetch 사용
router.post("/portone-webhook", async (req, res) => {
  try {
    const { payment_id } = req.body;
    const paymentDetails = await fetchPaymentDetails(payment_id);
    if (paymentDetails.status === "PAID") {
      console.log("Payment processed for payment ID:", payment_id);
      // 추가 로직 구현, 예: 데이터베이스 업데이트, 이메일 전송 등
      res.status(200).send("Payment processed successfully");
    } else {
      res.status(400).send("Payment processing failed");
    }
  } catch (error) {
    console.error("Error processing payment webhook:", error);
    res.status(500).send("Server error");
  }
});

async function fetchPaymentDetails(paymentId) {
  const response = await fetch(
    `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.PORTONE_API_KEY}`, // 환경변수에서 API 키를 가져옴
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch payment details");
  }
  return response.json();
}

module.exports = router;
