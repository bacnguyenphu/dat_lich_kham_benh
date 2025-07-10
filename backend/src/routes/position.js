import { handleCreatePosition, handleDeletePosition, handleGetPositions } from '../controllers/positionController'

const express = require('express')
const router = express.Router()

router.get('/get-postions',handleGetPositions)
router.post('/create-position',handleCreatePosition)
router.delete('/delete-position',handleDeletePosition)

export default router
