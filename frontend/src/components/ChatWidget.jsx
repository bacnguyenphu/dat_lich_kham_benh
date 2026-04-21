import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { getChatHistoryByCustomer } from "../services/chatService";
import {
  IoChatbubblesOutline,
  IoCheckmarkDoneCircleOutline,
} from "react-icons/io5";

const socket = io("http://localhost:3001", {
  autoConnect: false,
});

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [isEndedChat, setIsEndedChat] = useState(false);

  const user_id = useSelector((state) => state?.auth?.data?.id) || null;

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Chủ động kết nối khi component được render
    socket.connect();

    // Cleanup function: Ngắt kết nối khi rời khỏi component (hoặc reload trang, HMR)
    return () => {
      socket.disconnect();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isEndedChat]);

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
        socket.emit("join_room", { chat_room_id: roomId });
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử chat:", error);
      }
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      if (newMessage.sender_id === user_id) {
        return;
      }
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const handleRoomEnded = () => {
      setIsEndedChat(true);
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("room_has_been_ended", handleRoomEnded);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("room_has_been_ended", handleRoomEnded);
    };
  }, [user_id]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !currentRoomId) return;

    const messageData = {
      id: Date.now(),
      chat_room_id: currentRoomId,
      sender_id: user_id,
      sender_type: "CUSTOMER",
      content: inputText,
      createdAt: new Date().toISOString(),
    };

    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setInputText("");
  };

  const handleStartNewChat = () => {
    setIsOpen((prev) => !prev);
    setIsEndedChat(() => false);
    setCurrentRoomId(null);
    setMessages([]);
    setInputText("");
    toggleChat();
  };

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
            {messages.map((msg, index) => {
              const isCustomer = msg.sender_type === "CUSTOMER";

              // ==========================================
              // 1. LOGIC XỬ LÝ NGÀY (DATE DIVIDER)
              // ==========================================
              const currentDate = new Date(msg.createdAt);
              const prevDate =
                index > 0 ? new Date(messages[index - 1].createdAt) : null;

              let isDifferentDay = false;
              // Khác ngày nếu là tin đầu tiên HOẶC ngày/tháng/năm không trùng với tin trước đó
              if (!prevDate) {
                isDifferentDay = true;
              } else if (
                currentDate.getDate() !== prevDate.getDate() ||
                currentDate.getMonth() !== prevDate.getMonth() ||
                currentDate.getFullYear() !== prevDate.getFullYear()
              ) {
                isDifferentDay = true;
              }

              // Hàm chuyển đổi ngày thành chữ "Hôm nay", "Hôm qua" hoặc "DD/MM/YYYY"
              const formatDividerDate = (date) => {
                const today = new Date();
                if (date.toDateString() === today.toDateString())
                  return "Hôm nay";

                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                if (date.toDateString() === yesterday.toDateString())
                  return "Hôm qua";

                return date.toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                });
              };

              // ==========================================
              // 2. LOGIC XỬ LÝ GIỜ (GỘP TIN NHẮN CÙNG PHÚT)
              // ==========================================
              const nextMsg = messages[index + 1];
              const currentTimeStr = currentDate.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const nextTimeStr = nextMsg
                ? new Date(nextMsg.createdAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : null;

              // Chỉ hiện thời gian khi:
              // - Là tin nhắn cuối cùng của cuộc hội thoại
              // - HOẶC tin nhắn tiếp theo khác phút
              // - HOẶC tin nhắn tiếp theo là của người kia gửi (đổi luồng chat)
              const showTime =
                !nextMsg ||
                currentTimeStr !== nextTimeStr ||
                nextMsg.sender_type !== msg.sender_type;

              // ==========================================
              // 3. LOGIC BO GÓC BONG BÓNG (NỐI LIỀN NHAU)
              // ==========================================
              const isFirstInGroup =
                !prevDate ||
                messages[index - 1].sender_type !== msg.sender_type ||
                isDifferentDay;
              const isLastInGroup = showTime;

              return (
                <div key={msg.id}>
                  {/* Vạch ngăn cách khi sang ngày mới */}
                  {isDifferentDay && (
                    <div className="flex justify-center my-6">
                      <span className="text-[12px] text-gray-500 font-bold bg-gray-200/60 px-3 py-1 rounded-full">
                        {formatDividerDate(currentDate)}
                      </span>
                    </div>
                  )}

                  {/* Dòng Chat */}
                  <div
                    className={`flex w-full ${isCustomer ? "justify-end" : "justify-start"} ${isLastInGroup ? "mb-4" : "mb-[2px]"}`}
                  >
                    <div
                      className={`flex flex-col ${isCustomer ? "items-end" : "items-start"} max-w-[75%]`}
                    >
                      {/* Bong bóng tin nhắn */}
                      <div
                        className={`px-4 py-2 text-[15px] leading-relaxed break-words shadow-sm ${
                          isCustomer
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-800 border border-gray-200"
                        } ${
                          // Tạo hiệu ứng bo góc dính liền nhau cực xịn
                          isCustomer
                            ? `rounded-l-2xl ${isFirstInGroup ? "rounded-tr-2xl" : "rounded-tr-[4px]"} ${isLastInGroup ? "rounded-br-2xl" : "rounded-br-[4px]"}`
                            : `rounded-r-2xl ${isFirstInGroup ? "rounded-tl-2xl" : "rounded-tl-[4px]"} ${isLastInGroup ? "rounded-bl-2xl" : "rounded-bl-[4px]"}`
                        }`}
                      >
                        {msg.content}
                      </div>

                      {/* Dòng hiển thị Thời gian */}
                      {showTime && (
                        <span className="text-[11px] text-gray-400 mt-1 px-1 font-medium select-none">
                          {currentTimeStr}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Dùng div rỗng này để làm mỏ neo cuộn xuống cuối */}
            {isEndedChat && (
              <div className="flex flex-col items-center justify-center mt-4 mb-2 py-6 px-4 bg-slate-50/80 border border-slate-200 border-dashed rounded-2xl mx-4 sm:mx-12">
                <div className="w-12 h-12 bg-slate-200/50 text-slate-400 rounded-full flex items-center justify-center mb-3">
                  <IoCheckmarkDoneCircleOutline size="1.8rem" />
                </div>

                <p className="text-[14px] font-semibold text-slate-500 mb-4 text-center">
                  Cuộc trò chuyện này đã được kết thúc.
                </p>

                <button
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 text-[13.5px] font-bold rounded-full shadow-sm transition-all active:scale-95 cursor-pointer"
                  onClick={() => handleStartNewChat()}
                >
                  <IoChatbubblesOutline size="1.2rem" className="pb-[1px]" />
                  <span>Cuộc trò chuyện mới</span>
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer (Input & Nút gửi) */}
          <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isEndedChat}
            />
            <button
              className="bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors focus:outline-none shadow-sm"
              onClick={handleSendMessage}
            >
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
