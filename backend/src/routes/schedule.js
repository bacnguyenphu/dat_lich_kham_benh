const express = require('express')
const { handleCreateOrUpdateSchedule } = require('../controllers/scheduleController')
const router = express.Router()

router.post("/create-or-update-schedule",handleCreateOrUpdateSchedule)

export default router