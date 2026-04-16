import db from "../models/index";
import { v4 as uuidv4 } from "uuid";

const getChatHistoryByCustomer = async (id_user, limit = 50, offset = 0) => {
  try {
    // 1. Kiểm tra đầu vào (id_user này nên được lấy từ Token xác thực ở Controller)
    if (!id_user) {
      return {
        err: 1,
        message: "Thiếu thông tin định danh người dùng (id_user)",
      };
    }

    // 2. Tìm phòng chat của user, nếu chưa có thì tạo mới (Dùng findOrCreate tránh Race Condition)
    const [room_chat, created] = await db.Chat_room.findOrCreate({
      where: { customer_id: id_user },
      defaults: {
        id: uuidv4(),
        customer_id: id_user,
        status: "ACTIVE",
      },
    });

    const roomChatIdToFetch = room_chat.id;

    // 3. Lấy danh sách tin nhắn có phân trang
    const messages = await db.Message.findAll({
      where: { chat_room_id: roomChatIdToFetch },
      order: [["createdAt", "DESC"]], // Lấy tin nhắn mới nhất trước
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      raw: true,
    });

    // 4. Đảo ngược mảng để client hiển thị đúng thứ tự từ trên xuống dưới
    const sortedMessages = messages.reverse();

    return {
      err: 0,
      data: {
        id_chat_room: roomChatIdToFetch, // Trả về để client biết đang ở phòng nào
        messages: sortedMessages,
      },
    };
  } catch (error) {
    console.error("Lỗi ở getChatHistoryByCustomer: ", error);
    return {
      err: -999,
      message: "Lỗi hệ thống máy chủ, vui lòng thử lại sau.",
    };
  }
};

export { getChatHistoryByCustomer };
