import axios from "../utils/customAxios";

const getChatHistoryByCustomer = () => {
  return axios.get(`get-history-chat-by-customer`);
};

const getChatHistoryByReceptionist = (id_room_chat, limit, offset) => {
  return axios.get(
    `get-history-chat-by-receptionist?id_room_chat=${id_room_chat}&limit=${limit}&offset=${offset}`,
  );
};

const getAllChatRooms = () => {
  return axios.get(`get-all-chat-room`);
};

export {
  getChatHistoryByCustomer,
  getChatHistoryByReceptionist,
  getAllChatRooms,
};
