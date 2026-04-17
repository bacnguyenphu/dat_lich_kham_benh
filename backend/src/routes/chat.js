const express = require("express");
const {
  GET_HISTORY_CHAT_BY_CUSTOMER,
  GET_HISTORY_CHAT_BY_RECEPTIONIST,
} = require("../utils/routeUrlApi");
const {
  handleGetHistoryChatByCustomer,
  handleGetHistoryChatByReceptionist,
} = require("../controllers/chatController");
const router = express.Router();

router.get(GET_HISTORY_CHAT_BY_CUSTOMER, handleGetHistoryChatByCustomer);
router.get(
  GET_HISTORY_CHAT_BY_RECEPTIONIST,
  handleGetHistoryChatByReceptionist,
);

module.exports = router;
