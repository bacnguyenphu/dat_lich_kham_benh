const express = require("express");
const {
  GET_HISTORY_CHAT_BY_CUSTOMER,
  GET_HISTORY_CHAT_BY_RECEPTIONIST,
  GET_ALL_CHAT_ROOM,
} = require("../utils/routeUrlApi");
const {
  handleGetHistoryChatByCustomer,
  handleGetHistoryChatByReceptionist,
  handleGetAllChatRoom,
} = require("../controllers/chatController");
const router = express.Router();

router.get(GET_HISTORY_CHAT_BY_CUSTOMER, handleGetHistoryChatByCustomer);
router.get(
  GET_HISTORY_CHAT_BY_RECEPTIONIST,
  handleGetHistoryChatByReceptionist,
);
router.get(GET_ALL_CHAT_ROOM, handleGetAllChatRoom);

module.exports = router;
