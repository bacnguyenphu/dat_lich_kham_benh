import { getChatHistoryByCustomer } from "../services/chatService";

const handleGetHistoryChatByCustomer = async (req, res) => {
  try {
    const limit = 20; // Số lượng tin nhắn tối đa trả về
    const offset = 0; // Bắt đầu từ tin nhắn đầu tiên
    const id_user = req.user.id; // Lấy id_user từ JWT đã giải mã trong middleware
    const message = await getChatHistoryByCustomer(id_user, limit, offset);
    return res.status(200).json(message);
  } catch (error) {
    console.log("Lỗi ở handleGetHistoryChat: ", error);
  }
};

const handleGetHistoryChatByReceptionist = async (req, res) => {
  try {
    const limit = 20;
    const offset = 0;
    const { id_room_chat } = req.query; // Lấy id_room_chat từ query parameters
    const message = await getChatHistoryByReceptionist(
      id_room_chat,
      limit,
      offset,
    );
    return res.status(200).json(message);
  } catch (error) {
    console.log("Lỗi ở handleGetHistoryChatByReceptionist: ", error);
  }
};

export { handleGetHistoryChatByCustomer, handleGetHistoryChatByReceptionist };
