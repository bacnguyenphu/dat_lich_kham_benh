const express = require("express")
const { handleGetInfoToMakeAppointment, handleCreateAppointment } = require("../controllers/appointmentController")
const router = express.Router()

router.get("/get-info-make-appointment",handleGetInfoToMakeAppointment)
router.post("/create-appointment",handleCreateAppointment)

export default router