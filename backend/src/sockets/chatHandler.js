const { saveMessage } = require("../services/chatService");

const handleSocketEvents = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔵 Một user vừa kết nối: ${socket.id}`);

    // Người dùng join vào phòng (ID bệnh nhân hoặc ID luồng chat)
    socket.on("join_room", (data) => {
      const roomId = data.chat_room_id;
      if (roomId) {
        socket.join(roomId);
      }
    });

    socket.on("send_message", async (data) => {
      try {
        const chat_room_id = data.chat_room_id;
        const sender_id = data.sender_id;
        const sender_type = data.sender_type;
        const content = data.content;

        const saveMessageDB = await saveMessage({
          chat_room_id: chat_room_id,
          sender_id: sender_id,
          content: content,
          sender_type: sender_type,
        });

        if (saveMessageDB.err !== 0) {
          console.error("🔴 Lỗi lưu tin nhắn: ", saveMessageDB.message);
          return;
        }

        // Phát tin nhắn cho đối phương
        io.to(chat_room_id).emit("receive_message", {
          id: saveMessageDB.data.message.id,
          chat_room_id: chat_room_id,
          sender_id: sender_id,
          sender_type: sender_type,
          content: content,
          createdAt: saveMessageDB.data.message.createdAt,
        });
      } catch (error) {
        console.error("🔴 Lỗi lưu tin nhắn: ", error);
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔴 User ngắt kết nối: ${socket.id}`);
    });
  });
};

module.exports = handleSocketEvents;
