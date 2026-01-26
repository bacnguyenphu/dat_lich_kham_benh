import { GET_TIMEFRAMES } from '../utils/routeUrlApi'

const express = require('express')
const { handelGetTimeFrames } = require('../controllers/timeFrameController')
const router = express.Router()

router.get(GET_TIMEFRAMES, handelGetTimeFrames)

export default router