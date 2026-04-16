import { getChatHistoryByCustomer } from "../services/chatService";

const handleGetHistoryChatByCustomer = async (req, res) => {
  try {
    const limit = 20; // Số lượng tin nhắn tối đa trả về
    const offset = 0; // Bắt đầu từ tin nhắn đầu tiên
    const id_user = req.user.id; // Lấy id_user từ JWT đã giải mã trong middleware
    console.log("check id_usêr: ", id_user);

    const message = await getChatHistoryByCustomer(id_user, limit, offset);
    return res.status(200).json(message);
  } catch (error) {
    console.log("Lỗi ở handleGetHistoryChat: ", error);
  }
};

export { handleGetHistoryChatByCustomer };
