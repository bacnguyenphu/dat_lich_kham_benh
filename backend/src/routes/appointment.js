const express = require("express")
const { handleGetInfoToMakeAppointment, handleCreateAppointment, handleGetAppointmentOfUser } = require("../controllers/appointmentController")
const router = express.Router()

router.get("/get-info-make-appointment",handleGetInfoToMakeAppointment)
router.post("/create-appointment",handleCreateAppointment)
router.get("/get-appointment-of-user",handleGetAppointmentOfUser)

export default router