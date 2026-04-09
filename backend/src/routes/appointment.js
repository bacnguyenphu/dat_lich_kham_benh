const express = require("express");
const {
  handleGetInfoToMakeAppointment,
  handleCreateAppointment,
  handleGetAppointmentOfUser,
  handleUpdateStatusAppointment,
  handleGetAppointments,
  handleGetAppointmentById,
  handlePaymentConfirmation,
  handleCheckInConfirmation,
  handleGetAppointmentOfPatient,
} = require("../controllers/appointmentController");
const router = express.Router();
import {
  CHECK_IN_CONFIRMATION,
  CREATE_APPOINTMENT,
  GET_APPOINTMENTS,
  GET_APPOINTMENT_BY_ID,
  GET_APPOINTMENT_OF_PATIENT,
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
router.post(CHECK_IN_CONFIRMATION, handleCheckInConfirmation);
router.get(GET_APPOINTMENT_OF_PATIENT, handleGetAppointmentOfPatient);

export default router;
