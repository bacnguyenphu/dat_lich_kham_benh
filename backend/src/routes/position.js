import { handleGetPositions } from '../controllers/positionController'

const express = require('express')
const router = express.Router()

router.get('/get-postions',handleGetPositions)

export default router
