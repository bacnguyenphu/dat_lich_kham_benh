import axios from "../utils/customAxios";

const getChatHistoryByCustomer = () => {
  return axios.get(`get-history-chat-by-customer`);
};

export { getChatHistoryByCustomer };
