const express = require("express");
const router = express.Router();

import {
  handleLogin,
  handleLogout,
  handleRegister,
  handleCheckAdmin,
  requestRefreshToken,
  handleLoginDoctor,
  handleChangePasswordDoctor,
  handleLoginReceptionist,
} from "../controllers/authController";
import {
  CHANGE_PASSWORD_DOCTOR,
  LOGIN,
  LOGIN_DOCTOR,
  LOGIN_RECEPTIONIST,
  LOGOUT,
  NAVIGATE_ADMIN,
  REFRESH_TOKEN,
  REGISTER,
} from "../utils/routeUrlApi";

router.post(REGISTER, handleRegister);
router.post(LOGIN, handleLogin);
router.post(REFRESH_TOKEN, requestRefreshToken);
router.post(LOGOUT, handleLogout);
router.get(NAVIGATE_ADMIN, handleCheckAdmin, async (req, res) => {
  return res.status(200).json({
    err: 0,
    message: "You are admin",
  });
});

router.post(LOGIN_DOCTOR, handleLoginDoctor);
router.post(CHANGE_PASSWORD_DOCTOR, handleChangePasswordDoctor);
router.post(LOGIN_RECEPTIONIST, handleLoginReceptionist);

export default router;
