const express = require('express')
const { handleCreateOrUpdateSchedule, handleGetScheduleFollowDate } = require('../controllers/scheduleController')
const router = express.Router()

router.post("/create-or-update-schedule",handleCreateOrUpdateSchedule)
router.get("/get-schedule-follow-date",handleGetScheduleFollowDate)

export default router