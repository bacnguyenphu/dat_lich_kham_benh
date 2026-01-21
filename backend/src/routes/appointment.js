const express = require("express")
const { handleGetInfoToMakeAppointment, handleCreateAppointment, handleGetAppointmentOfUser, handleUpdateStatusAppointment, handleGetAppointmentOfDoctor } = require("../controllers/appointmentController")
const router = express.Router()
import { checkUserJWT } from '../middleware/JWTaction'
import {
    CREATE_APPOINTMENT, GET_APPOINTMENT_OF_DOCTOR, GET_APPOINTMENT_OF_USER,
    GET_INFOR_MAKE_APPOINTMENT, UPDATE_STATUS_APPOINTMENT
} from '../utils/routeUrlApi'

router.get(GET_INFOR_MAKE_APPOINTMENT, handleGetInfoToMakeAppointment)
router.post(CREATE_APPOINTMENT, checkUserJWT, handleCreateAppointment)
router.get(GET_APPOINTMENT_OF_USER, handleGetAppointmentOfUser)
router.get(GET_APPOINTMENT_OF_DOCTOR, handleGetAppointmentOfDoctor)
router.put(UPDATE_STATUS_APPOINTMENT, handleUpdateStatusAppointment)

export default router