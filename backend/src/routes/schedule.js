import { handleCheckAdmin } from '../controllers/authController'
import { checkUserJWT } from '../middleware/JWTaction'
import { CREATE_OR_UPDATE_SCHEDULE, GET_SCHEDULE_FOLLOW_DATE, GET_SCHEDULE_OF_DOCTOR } from '../utils/routeUrlApi'

const express = require('express')
const router = express.Router()
const { handleCreateOrUpdateSchedule, handleGetScheduleFollowDate, handleGetScheduleOfDoctor } = require('../controllers/scheduleController')

router.post(CREATE_OR_UPDATE_SCHEDULE, checkUserJWT, handleCreateOrUpdateSchedule)
router.get(GET_SCHEDULE_FOLLOW_DATE, handleGetScheduleFollowDate)
router.get(GET_SCHEDULE_OF_DOCTOR, handleGetScheduleOfDoctor)

export default router