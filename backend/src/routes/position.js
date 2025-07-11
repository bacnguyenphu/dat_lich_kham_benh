import { handleCreatePosition, handleDeletePosition, handleGetPositionById, handleGetPositions, handleUpdatePosition } from '../controllers/positionController'

const express = require('express')
const router = express.Router()

router.get('/get-postions',handleGetPositions)
router.post('/create-position',handleCreatePosition)
router.delete('/delete-position',handleDeletePosition)
router.put('/update-position',handleUpdatePosition)
router.get('/get-position-by-id',handleGetPositionById)

export default router
