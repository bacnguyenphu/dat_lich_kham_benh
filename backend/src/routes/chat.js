const express = require("express");
const { GET_HISTORY_CHAT_BY_CUSTOMER } = require("../utils/routeUrlApi");
const {
  handleGetHistoryChatByCustomer,
} = require("../controllers/chatController");
const router = express.Router();

router.get(GET_HISTORY_CHAT_BY_CUSTOMER, handleGetHistoryChatByCustomer);

module.exports = router;
