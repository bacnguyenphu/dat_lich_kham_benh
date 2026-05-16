const { VNPay } = require("vnpay");

import db from "../models";
const fs = require("fs");
const path = require("path");
import { sendEmailPaidVnpay } from "../services/emailService";

const vnpay = new VNPay({
  tmnCode: "SUHEFNZV",
  secureSecret: "NUATX4AOSMR940Q14QWNEMF3RANAVOL2",
  vnpayHost: "https://sandbox.vnpayment.vn",
  testMode: true,
  hashAlgorithm: "SHA512",
});

const createPayment = async (req, res) => {
  try {
    const { appointmentId, amount } = req.body;

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: Number(amount),
      vnp_IpAddr: req.ip === "::1" ? "127.0.0.1" : req.ip || "127.0.0.1",
      vnp_TxnRef: String(appointmentId),
      vnp_OrderInfo: `Thanh toan dat lich hen ${appointmentId}`,
      vnp_OrderType: "other",
      vnp_ReturnUrl: "http://localhost:3001/api/vnpay-ipn",
      vnp_Locale: "vn",
    });

    return res.status(200).json({
      success: true,
      message: "Tạo thanh toán thành công",
      paymentUrl,
    });
  } catch (error) {
    console.log("Lỗi khi tạo thanh toán:", error.message);

    return res.status(500).json({
      success: false,
      message: "Lỗi khi tạo thanh toán",
      error: error.message,
      RspCode: "99",
    });
  }
};

const handleVnpayIpn = async (req, res) => {
  // Khai báo biến ở ngoài cùng để block catch cũng có thể sử dụng được
  let bookingId = "N/A";

  try {
    const verify = vnpay.verifyIpnCall(req.query);

    if (verify.isSuccess) {
      bookingId = verify.vnp_TxnRef; // Gán mã lịch hẹn
      const responseCode = verify.vnp_ResponseCode;

      if (responseCode === "00") {
        // --- 1. Lấy thông tin lịch hẹn từ DB ---
        const appointment = await db.Appointment.findOne({
          where: { id: bookingId },
        });

        // Nếu cuộc hẹn tồn tại và chưa thanh toán -> Tiến hành cập nhật
        if (appointment && appointment.payment_status !== "paid") {
          appointment.payment_status = "paid";
          await appointment.save();

          // Gửi email thông báo thanh toán thành công tới bệnh nhân
          sendEmailPaidVnpay(bookingId);
        }

        // --- 2. Trả về giao diện THÀNH CÔNG ---
        const successTemplatePath = path.join(
          __dirname,
          "../views/paymentSuccess.html",
        );
        let htmlContent = fs.readFileSync(successTemplatePath, "utf8");
        htmlContent = htmlContent.replace("{{bookingId}}", bookingId);

        return res.send(htmlContent);
      } else {
        // --- Trả về giao diện THẤT BẠI (Do khách hủy hoặc lỗi thẻ) ---
        const failedTemplatePath = path.join(
          __dirname,
          "../views/paymentFailed.html",
        );
        let htmlContent = fs.readFileSync(failedTemplatePath, "utf8");
        htmlContent = htmlContent.replace("{{bookingId}}", bookingId);

        return res.send(htmlContent);
      }
    } else {
      // --- Trả về giao diện THẤT BẠI (Do sai chữ ký/Bị hack URL) ---
      const failedTemplatePath = path.join(
        __dirname,
        "../views/paymentFailed.html",
      );
      let htmlContent = fs.readFileSync(failedTemplatePath, "utf8");
      htmlContent = htmlContent.replace("{{bookingId}}", "Lỗi chữ ký bảo mật");

      return res.send(htmlContent);
    }
  } catch (error) {
    console.log("Lỗi xử lý IPN:", error.message);

    // --- Trả về giao diện THẤT BẠI (Nếu code bị lỗi sập) ---
    const failedTemplatePath = path.join(
      __dirname,
      "../views/paymentFailed.html",
    );
    let htmlContent = fs.readFileSync(failedTemplatePath, "utf8");
    htmlContent = htmlContent.replace("{{bookingId}}", bookingId);

    return res.send(htmlContent);
  }
};

export { createPayment, handleVnpayIpn };
