import { handleCheckAdmin } from '../controllers/authController'
import { handleCreatePosition, handleDeletePosition, handleGetPositionById, handleGetPositions, handleUpdatePosition } from '../controllers/positionController'
import { checkUserJWT } from '../middleware/JWTaction'

const express = require('express')
const router = express.Router()

router.get('/get-postions',handleGetPositions)
router.post('/create-position',checkUserJWT,handleCheckAdmin,handleCreatePosition)
router.delete('/delete-position',checkUserJWT,handleCheckAdmin,handleDeletePosition)
router.put('/update-position',checkUserJWT,handleCheckAdmin,handleUpdatePosition)
router.get('/get-position-by-id',handleGetPositionById)

export default router
