import React, { useState } from "react";
import {
  IoSearch,
  IoSend,
  IoImageOutline,
  IoCallOutline,
  IoVideocamOutline,
  IoEllipsisHorizontal,
} from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";

// 1. DỮ LIỆU MẪU (MOCK DATA) ĐỂ DỰNG UI
const mockPatients = [
  {
    id: 1,
    name: "Nguyễn Hữu Nam",
    avatar: "",
    lastMessage: "Dạ vâng, cảm ơn phòng khám.",
    time: "10:30",
    unread: 0,
    isOnline: true,
  },
  {
    id: 2,
    name: "Trần Thị Nhung",
    avatar: "",
    lastMessage: "Mình muốn đổi lịch khám sang ngày mai được không?",
    time: "09:15",
    unread: 2,
    isOnline: false,
  },
  {
    id: 3,
    name: "Lê Văn Luyện",
    avatar: "",
    lastMessage: "Chi phí gói khám tổng quát là bao nhiêu vậy ạ?",
    time: "Hôm qua",
    unread: 0,
    isOnline: true,
  },
  {
    id: 4,
    name: "Phạm Hoàng Yến",
    avatar: "",
    lastMessage: "Bác sĩ Nguyễn khám lúc mấy giờ?",
    time: "Hôm qua",
    unread: 0,
    isOnline: false,
  },
];

const mockMessages = [
  {
    id: 1,
    sender: "patient",
    text: "Chào bạn, cho mình hỏi một chút được không?",
    time: "09:00",
  },
  {
    id: 2,
    sender: "me",
    text: "Dạ chào anh Nam, phòng khám có thể giúp gì cho anh ạ?",
    time: "09:05",
  },
  {
    id: 3,
    sender: "patient",
    text: "Mình muốn hỏi chi phí nhổ răng khôn bên mình là bao nhiêu?",
    time: "09:10",
  },
  {
    id: 4,
    sender: "me",
    text: "Dạ chi phí nhổ răng khôn dao động từ 1.000.000đ đến 3.000.000đ tùy mức độ mọc lệch ạ. Anh có muốn đặt lịch đến khám chụp X-Quang trước không ạ?",
    time: "09:15",
  },
  {
    id: 5,
    sender: "patient",
    text: "Tuyệt quá, đặt cho mình chiều nay nhé.",
    time: "10:25",
  },
  {
    id: 6,
    sender: "me",
    text: "Dạ vâng, hệ thống đã ghi nhận lịch của anh vào 14:00 chiều nay. Cảm ơn anh!",
    time: "10:26",
  },
];

function ReceptionistChat() {
  const [activeChat, setActiveChat] = useState(mockPatients[0]); // Mặc định chọn người đầu tiên
  const [inputText, setInputText] = useState("");

  return (
    <div className="bg-slate-50 min-h-screen animate-[fadeIn_0.3s_ease-out]">
      <div className="max-w-7xl mx-auto h-[calc(100vh-120px)] bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex">
        {/* ==========================================
            BÊN TRÁI: DANH SÁCH BỆNH NHÂN (SIDEBAR)
        ========================================== */}
        <div className="w-full md:w-[350px] lg:w-[400px] border-r border-slate-200 flex flex-col shrink-0 bg-white">
          {/* Header Sidebar */}
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Tin nhắn</h2>
            {/* Khối Tìm kiếm */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <IoSearch className="text-slate-400" size="1.2rem" />
              </div>
              <input
                type="text"
                className="w-full bg-slate-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-[14px] text-slate-700 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 transition-all outline-none"
                placeholder="Tìm kiếm cuộc trò chuyện..."
              />
            </div>
          </div>

          {/* Danh sách Chat (Có thanh cuộn) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {mockPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => setActiveChat(patient)}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                  activeChat.id === patient.id
                    ? "bg-blue-50"
                    : "hover:bg-slate-50"
                }`}
              >
                {/* Avatar kèm chấm Online */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center font-bold text-lg border border-slate-100">
                    {patient.name.charAt(0)}
                  </div>
                  {patient.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* Thông tin hiển thị */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3
                      className={`text-[15px] truncate ${activeChat.id === patient.id ? "font-bold text-blue-700" : "font-semibold text-slate-800"}`}
                    >
                      {patient.name}
                    </h3>
                    <span
                      className={`text-xs ${patient.unread > 0 ? "text-blue-600 font-bold" : "text-slate-400"}`}
                    >
                      {patient.time}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p
                      className={`text-[13px] truncate pr-2 ${patient.unread > 0 ? "text-slate-800 font-semibold" : "text-slate-500"}`}
                    >
                      {patient.lastMessage}
                    </p>
                    {/* Badge tin nhắn chưa đọc */}
                    {patient.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {patient.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================
            BÊN PHẢI: KHU VỰC NHẮN TIN (CHAT AREA)
        ========================================== */}
        {activeChat ? (
          <div className="flex-1 flex flex-col bg-[#f0f2f5]">
            {" "}
            {/* Màu nền giống Messenger/Zalo */}
            {/* Header Chat */}
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                    {activeChat.name.charAt(0)}
                  </div>
                  {activeChat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-slate-800 leading-tight">
                    {activeChat.name}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {activeChat.isOnline
                      ? "Đang hoạt động"
                      : "Hoạt động 15 phút trước"}
                  </p>
                </div>
              </div>

              {/* Các nút công cụ Header */}
              <div className="flex items-center gap-3 text-blue-600">
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <IoCallOutline size="1.4rem" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <IoVideocamOutline size="1.4rem" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                  <IoEllipsisHorizontal size="1.4rem" />
                </button>
              </div>
            </div>
            {/* Thân Chat (Nơi chứa tin nhắn) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="text-center text-xs text-slate-400 font-medium my-4">
                Hôm nay, 09:00
              </div>

              {mockMessages.map((msg) => {
                const isMe = msg.sender === "me";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[70%]`}
                    >
                      <div
                        className={`px-4 py-2.5 text-[15px] ${
                          isMe
                            ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-sm"
                            : "bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 px-1">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Vùng nhập tin nhắn (Bottom Input) */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0 flex items-center gap-3">
              <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors">
                <IoImageOutline size="1.5rem" />
              </button>

              <div className="flex-1 flex items-center bg-slate-100 rounded-full px-4 py-2 border border-transparent focus-within:border-slate-300 transition-colors">
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none focus:outline-none text-[15px] text-slate-700"
                  placeholder="Nhập tin nhắn..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inputText.trim()) {
                      console.log("Send:", inputText);
                      setInputText("");
                    }
                  }}
                />
                <button className="text-slate-400 hover:text-yellow-500 transition-colors px-2">
                  <BsEmojiSmile size="1.2rem" />
                </button>
              </div>

              <button
                className={`p-2.5 rounded-full transition-all ${
                  inputText.trim()
                    ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                <IoSend size="1.2rem" className="ml-1" />
              </button>
            </div>
          </div>
        ) : (
          /* Trạng thái chưa chọn cuộc trò chuyện nào */
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
            <div className="w-24 h-24 bg-blue-50 text-blue-300 rounded-full flex items-center justify-center mb-4">
              <FaUserCircle size="4rem" />
            </div>
            <h3 className="text-xl font-bold text-slate-600">
              Tin nhắn Lễ tân
            </h3>
            <p className="text-slate-500 mt-2">
              Chọn một bệnh nhân ở danh sách bên trái để bắt đầu trò chuyện
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReceptionistChat;
