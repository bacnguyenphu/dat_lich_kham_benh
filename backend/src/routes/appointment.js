const express = require("express");
const {
  handleGetInfoToMakeAppointment,
  handleCreateAppointment,
  handleGetAppointmentOfUser,
  handleUpdateStatusAppointment,
  handleGetAppointments,
  handleGetAppointmentById,
  handlePaymentConfirmation,
} = require("../controllers/appointmentController");
const router = express.Router();
import {
  CREATE_APPOINTMENT,
  GET_APPOINTMENTS,
  GET_APPOINTMENT_BY_ID,
  GET_APPOINTMENT_OF_USER,
  GET_INFOR_MAKE_APPOINTMENT,
  PAYMENT_CONFIRMATION,
  UPDATE_STATUS_APPOINTMENT,
} from "../utils/routeUrlApi";

router.get(GET_INFOR_MAKE_APPOINTMENT, handleGetInfoToMakeAppointment);
router.post(CREATE_APPOINTMENT, handleCreateAppointment);
router.get(GET_APPOINTMENT_OF_USER, handleGetAppointmentOfUser);
router.get(GET_APPOINTMENTS, handleGetAppointments);
router.put(UPDATE_STATUS_APPOINTMENT, handleUpdateStatusAppointment);
router.get(GET_APPOINTMENT_BY_ID, handleGetAppointmentById);
router.put(PAYMENT_CONFIRMATION, handlePaymentConfirmation);

export default router;
