const express = require("express")
const { handleGetInfoToMakeAppointment } = require("../controllers/appointmentController")
const router = express.Router()

router.get("/get-info-make-appointment",handleGetInfoToMakeAppointment)

export default router