const { handleGetStatistics } = require("../controllers/statisticalController");

const express = require("express");
const { STATISTICAL } = require("../utils/routeUrlApi");
const router = express.Router();

router.get(STATISTICAL, handleGetStatistics);

module.exports = router;
