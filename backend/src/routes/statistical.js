const { handleGetStatistics } = require("../controllers/statisticalController");

const express = require("express");
const router = express.Router();

router.get("/statistics", handleGetStatistics);

module.exports = router;
