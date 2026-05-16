import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [paymentData, setPaymentData] = useState({
    bookingId: "",
    amount: "",
    orderInfo: "",
  });

  useEffect(() => {
    // Lấy query parameters từ URL của VNPay trả về
    const searchParams = new URLSearchParams(location.search);
    const responseCode = searchParams.get("vnp_ResponseCode");
    const txnRef = searchParams.get("vnp_TxnRef");
    const amount = searchParams.get("vnp_Amount");
    const orderInfo = searchParams.get("vnp_OrderInfo");

    // VNPay nhân số tiền với 100, nên khi hiển thị cần chia lại cho 100
    const displayAmount = amount
      ? (parseInt(amount, 10) / 100).toLocaleString("vi-VN") + " VNĐ"
      : "0 VNĐ";

    setPaymentData({
      bookingId: txnRef || "Không xác định",
      amount: displayAmount,
      orderInfo: orderInfo || "Không có thông tin",
    });

    if (responseCode === "00") {
      setStatus("success");
    } else if (responseCode) {
      setStatus("failed");
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Phần Header chứa Icon */}
        <div
          className={`p-6 text-center ${status === "success" ? "bg-green-50" : status === "failed" ? "bg-red-50" : "bg-blue-50"}`}
        >
          <div className="flex justify-center mb-4">
            {status === "success" && (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
            {status === "failed" && (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
            {status === "processing" && (
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                <svg
                  className="w-8 h-8 text-blue-500 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
            )}
          </div>
          <h2
            className={`text-2xl font-bold ${status === "success" ? "text-green-700" : status === "failed" ? "text-red-700" : "text-blue-700"}`}
          >
            {status === "success"
              ? "Thanh toán thành công!"
              : status === "failed"
                ? "Thanh toán thất bại!"
                : "Đang xử lý..."}
          </h2>
          <p className="text-gray-600 mt-2 text-sm">
            {status === "success"
              ? "Cảm ơn bạn đã sử dụng dịch vụ đặt lịch của chúng tôi."
              : status === "failed"
                ? "Giao dịch đã bị hủy hoặc xảy ra lỗi trong quá trình thanh toán."
                : "Vui lòng đợi trong giây lát..."}
          </p>
        </div>

        {/* Phần chi tiết giao dịch */}
        {status !== "processing" && (
          <div className="p-6">
            <h3 className="text-gray-800 font-semibold mb-4 border-b pb-2">
              Chi tiết giao dịch
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Mã lịch hẹn:</span>
                <span className="font-medium text-gray-800">
                  {paymentData.bookingId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số tiền:</span>
                <span className="font-bold text-gray-800">
                  {paymentData.amount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nội dung:</span>
                <span className="font-medium text-gray-800 text-right w-2/3 truncate">
                  {paymentData.orderInfo}
                </span>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="mt-8 space-y-3">
              {status === "failed" && (
                <button
                  onClick={() => navigate(-1)} // Quay lại trang trước để thanh toán lại
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200"
                >
                  Thử thanh toán lại
                </button>
              )}
              <button
                onClick={() => navigate("/")}
                className={`w-full font-semibold py-3 px-4 rounded-xl transition duration-200 ${
                  status === "success"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Về trang chủ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
