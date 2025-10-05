const express = require('express')
const router = express.Router()
const { handleCreateOrUpdateSchedule, handleGetScheduleFollowDate, handleGetScheduleOfDoctor } = require('../controllers/scheduleController')

router.post("/create-or-update-schedule",handleCreateOrUpdateSchedule)
router.get("/get-schedule-follow-date",handleGetScheduleFollowDate)
router.get("/get-schedule-of-doctor",handleGetScheduleOfDoctor)

export default router