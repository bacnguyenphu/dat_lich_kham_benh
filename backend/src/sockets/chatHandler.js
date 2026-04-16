const handleSocketEvents = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔵 Một user vừa kết nối: ${socket.id}`);

    // Người dùng join vào phòng (ID bệnh nhân hoặc ID luồng chat)
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} đã tham gia phòng: ${roomId}`);
    });

    // Nhận tin nhắn và phát lại cho phòng
    socket.on("send_message", (data) => {
      // data bao gồm: roomId, senderId, text...
      // Phát tin nhắn đến tất cả user trong roomId
      io.to(data.roomId).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
      console.log(`🔴 User ngắt kết nối: ${socket.id}`);
    });
  });
};

module.exports = handleSocketEvents;
