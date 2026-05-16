const express = require("express");
const router = express.Router();

import { CREATE_PAYMENT, VNPAY_IPN } from "../utils/routeUrlApi";
import {
  createPayment,
  handleVnpayIpn,
} from "../controllers/paymentController";

router.post(CREATE_PAYMENT, createPayment);
router.get(VNPAY_IPN, handleVnpayIpn);

module.exports = router;
