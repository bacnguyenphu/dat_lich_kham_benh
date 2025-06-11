const express = require('express')
const { handelGetTimeFrames } = require('../controllers/timeFrameController')
const router = express.Router()

router.get("/get-timeFrames",handelGetTimeFrames)

export default router