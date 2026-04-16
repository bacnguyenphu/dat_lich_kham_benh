import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { getChatHistoryByCustomer } from "../services/chatService";

const socket = io("http://localhost:3001");

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [currentRoomId, setCurrentRoomId] = useState(null);

  const user_id = useSelector((state) => state?.auth?.data?.id) || null;

  const messagesEndRef = useRef(null);

  // Dữ liệu mẫu (mock data)
  // const mockMessages = [
  //   {
  //     id: 1,
  //     senderRole: "RECEPTIONIST",
  //     text: "Chào bạn, phòng khám có thể giúp gì cho bạn hôm nay?",
  //   },
  //   {
  //     id: 2,
  //     senderRole: "PATIENT",
  //     text: "Mình muốn hỏi lịch làm việc của bác sĩ chuyên khoa nội.",
  //   },
  //   {
  //     id: 3,
  //     senderRole: "RECEPTIONIST",
  //     text: "Bác sĩ chuyên khoa nội làm việc từ thứ 2 đến thứ 6, trong giờ hành chính ạ.",
  //   },
  // ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const toggleChat = async () => {
    const willOpen = !isOpen;
    setIsOpen(willOpen);

    if (willOpen && !currentRoomId && user_id) {
      try {
        const res = await getChatHistoryByCustomer(); // Lúc đầu chưa có room-id, chỉ gửi patientId

        if (res.err !== 0) {
          console.error("Lỗi khi lấy lịch sử chat:", res.data.message);
          return;
        }
        const roomId = res.data?.id_chat_room;
        const historyMessages = res.data?.messages || [];

        setCurrentRoomId(roomId);
        setMessages(historyMessages);

        // Join room bằng biến socket import trực tiếp
        socket.emit("join_room", { "room-id": roomId });
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử chat:", error);
      }
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Cửa sổ Chat */}
      {isOpen && (
        <div className="w-[350px] h-[500px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-sm z-10">
            <h4 className="m-0 text-base font-semibold">Hỗ trợ trực tuyến</h4>
            <button
              className="text-white text-2xl leading-none hover:text-blue-100 transition-colors focus:outline-none"
              onClick={toggleChat}
            >
              &times;
            </button>
          </div>

          {/* Body (Danh sách tin nhắn) */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.senderRole === "PATIENT" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 text-sm leading-relaxed break-words shadow-sm ${
                    msg.senderRole === "PATIENT"
                      ? "bg-blue-500 text-white rounded-2xl rounded-br-sm" // Bong bóng bên phải (Bệnh nhân)
                      : "bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100" // Bong bóng bên trái (Lễ tân)
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {/* Dùng div rỗng này để làm mỏ neo cuộn xuống cuối */}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer (Input & Nút gửi) */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <button className="bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors focus:outline-none shadow-sm">
              Gửi
            </button>
          </div>
        </div>
      )}

      {/* Nút Bong bóng Chat */}
      {!isOpen && (
        <button
          className="w-14 h-14 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 hover:scale-105 transition-all duration-200 focus:outline-none"
          onClick={toggleChat}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
