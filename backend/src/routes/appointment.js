const express = require("express")
const { handleGetInfoToMakeAppointment, handleCreateAppointment, handleGetAppointmentOfUser, handleUpdateStatusAppointment } = require("../controllers/appointmentController")
const router = express.Router()
import { checkUserJWT } from '../middleware/JWTaction'

router.get("/get-info-make-appointment",handleGetInfoToMakeAppointment)
router.post("/create-appointment",checkUserJWT,handleCreateAppointment)
router.get("/get-appointment-of-user",handleGetAppointmentOfUser)
router.put("/update-status-appointment",handleUpdateStatusAppointment)

export default router