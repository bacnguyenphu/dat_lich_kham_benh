import React, { useState, useEffect } from "react";
import {
  IoSearch,
  IoSend,
  IoEllipsisHorizontal,
  IoCheckmarkCircleOutline,
  IoStopCircleOutline,
} from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import {
  getAllChatRooms,
  getChatHistoryByReceptionist,
} from "../../services/chatService";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  autoConnect: false,
});

function ReceptionistChat() {
  const auth = useSelector((state) => state.auth);
  const user_id = auth.data?.id;
  const [chatRooms, setChatRooms] = useState([]);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [activeChat, setActiveChat] = useState(null); // Đổi mặc định thành null
  const [inputText, setInputText] = useState("");

  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // Format thời gian từ ISO string sang HH:mm
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Dùng hàm scrollTo của chính cái khung chứa tin nhắn
      messagesEndRef.current.scrollTo({
        top: messagesEndRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const res = await getAllChatRooms();
        // Giả sử API trả về mảng trực tiếp hoặc nằm trong res.data
        const roomsData = res.data || res;

        setChatRooms(roomsData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách phòng chat:", error);
      }
    };

    fetchChatRooms();
  }, [currentRoomId]);

  useEffect(() => {
    socket.on("new_room_created", (newRoom) => {
      // Thêm phòng mới vào đầu danh sách
      setChatRooms((prevRooms) => [newRoom, ...prevRooms]);
    });

    const handleReceiveMessage = (newMessage) => {
      // console.log("check receive: ", newMessage);

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("actived_room_chat", (updateRoom) => {
      setActiveChat((prev) => {
        if (prev && prev.id === updateRoom.id) {
          return { ...prev, ...updateRoom };
        }
        return prev;
      });
    });

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("new_room_created");
      socket.off("actived_room_chat");
    };
  }, []);

  useEffect(() => {
    if (currentRoomId) {
      socket.emit("join_room", { chat_room_id: currentRoomId });
      const fetchMessages = async () => {
        try {
          const res = await getChatHistoryByReceptionist(currentRoomId);
          if (res.err === 0) {
            setMessages(res.data.messages);
          } else {
            console.error("Lỗi khi tải lịch sử chat:", res.message);
          }
        } catch (error) {
          console.error("Lỗi khi tải lịch sử chat:", error);
        }
      };
      fetchMessages();
    }
  }, [currentRoomId]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !currentRoomId) return;

    const messageData = {
      id: Date.now(),
      chat_room_id: currentRoomId,
      sender_id: user_id,
      sender_type: "RECEPTIONIST",
      content: inputText,
      createdAt: new Date().toISOString(),
    };

    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setInputText("");
  };

  const handleAcceptChat = (roomId) => {
    socket.emit("active_room_chat", {
      chat_room_id: roomId,
      receptionist_id: user_id,
    });
    const messageData = {
      id: Date.now(),
      chat_room_id: currentRoomId,
      sender_id: user_id,
      sender_type: "RECEPTIONIST",
      content: `Lễ tân ${auth.data?.firstName || ""} ${auth.data?.lastName || ""} đã tiếp nhận cuộc trò chuyện.`,
      createdAt: new Date().toISOString(),
    };

    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
  };

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

          {/* Danh sách Chat */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
            {chatRooms.map((room) => {
              const customerName =
                `${room.customer?.firstName || ""} ${room.customer?.lastName || ""}`.trim();
              const isOnline = room.status === "ACTIVE"; // Hoặc theo logic online của bạn

              return (
                <div
                  key={room.id}
                  onClick={() => {
                    setActiveChat(room);
                    setCurrentRoomId(room.id);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${
                    activeChat?.id === room.id
                      ? "bg-blue-50"
                      : "hover:bg-slate-50"
                  }`}
                >
                  {/* Avatar kèm chấm Online */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center font-bold text-lg border border-slate-100">
                      {customerName
                        ? customerName.charAt(0).toUpperCase()
                        : "?"}
                    </div>
                    {isOnline && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* Thông tin hiển thị */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h3
                        className={`text-[15px] truncate ${
                          activeChat?.id === room.id
                            ? "font-bold text-blue-700"
                            : "font-semibold text-slate-800"
                        }`}
                      >
                        {customerName}
                      </h3>
                      <span className="text-xs text-slate-400">
                        {formatTime(room.updatedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-[13px] text-slate-500 truncate pr-2">
                        {room.last_message || "Chưa có tin nhắn"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==========================================
            BÊN PHẢI: KHU VỰC NHẮN TIN (CHAT AREA)
        ========================================== */}
        {activeChat ? (
          <div className="flex-1 flex flex-col bg-[#f0f2f5]">
            {/* Header Chat */}
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                    {activeChat.customer?.firstName?.charAt(0).toUpperCase() ||
                      "?"}
                  </div>
                  {activeChat.status === "ACTIVE" && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-slate-800 leading-tight">
                    {`${activeChat.customer?.firstName || ""} ${activeChat.customer?.lastName || ""}`.trim()}
                  </h2>
                </div>
              </div>

              {/* Các nút công cụ Header */}
              <div className="flex items-center gap-3 text-blue-600">
                {activeChat.status === "WAITING" && (
                  <button
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-bold rounded-full shadow-sm transition-all active:scale-95"
                    title="Tiếp nhận cuộc trò chuyện này"
                    onClick={() => handleAcceptChat(activeChat.id)} // Hàm gọi API của bạn
                  >
                    <IoCheckmarkCircleOutline size="1.2rem" />
                    <span>Tiếp nhận</span>
                  </button>
                )}

                {activeChat.status === "ACTIVE" && (
                  <button
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[13px] font-bold rounded-full shadow-sm transition-all active:scale-95"
                    title="Kết thúc cuộc trò chuyện"
                    // onClick={() => handleEndChat(activeChat.id)} // Hàm gọi API của bạn
                  >
                    <IoStopCircleOutline size="1.2rem" />
                    <span>Kết thúc</span>
                  </button>
                )}
                <button className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                  <IoEllipsisHorizontal size="1.4rem" />
                </button>
              </div>
            </div>

            {/* Thân Chat (Nơi chứa tin nhắn) */}
            <div
              className="flex-1 overflow-y-auto p-6 space-y-4"
              ref={messagesEndRef}
            >
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
                      className={`flex w-full ${!isCustomer ? "justify-end" : "justify-start"} ${isLastInGroup ? "mb-4" : "mb-[2px]"}`}
                    >
                      <div
                        className={`flex flex-col ${!isCustomer ? "items-end" : "items-start"} max-w-[75%]`}
                      >
                        {/* Bong bóng tin nhắn */}
                        <div
                          className={`px-4 py-2 text-[15px] leading-relaxed break-words shadow-sm ${
                            !isCustomer
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-800 border border-gray-200"
                          } ${
                            // Tạo hiệu ứng bo góc dính liền nhau cực xịn
                            !isCustomer
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
            </div>

            {/* Vùng nhập tin nhắn (Bottom Input) */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0 flex items-center gap-3">
              <div className="flex-1 flex items-center bg-slate-100 rounded-full px-4 py-2 border border-transparent focus-within:border-slate-300 transition-colors">
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none focus:outline-none text-[15px] text-slate-700"
                  placeholder="Nhập tin nhắn..."
                  disabled={activeChat.status !== "ACTIVE"} // Chỉ cho phép nhập khi cuộc trò chuyện đang ACTIVE
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendMessage();
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
                onClick={() => {
                  handleSendMessage();
                }}
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
