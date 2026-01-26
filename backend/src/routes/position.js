import { handleCheckAdmin } from '../controllers/authController'
import { handleCreatePosition, handleDeletePosition, handleGetPositionById, handleGetPositions, handleUpdatePosition } from '../controllers/positionController'
import { checkUserJWT } from '../middleware/JWTaction'
import { CREATE_POSITION, DELETE_POSITION, GET_POSITION_BY_ID, GET_POSITIONS, UPDATE_POSITION } from '../utils/routeUrlApi'

const express = require('express')
const router = express.Router()

router.get(GET_POSITIONS, handleGetPositions)
router.post(CREATE_POSITION, checkUserJWT, handleCheckAdmin, handleCreatePosition)
router.delete(DELETE_POSITION, checkUserJWT, handleCheckAdmin, handleDeletePosition)
router.put(UPDATE_POSITION, checkUserJWT, handleCheckAdmin, handleUpdatePosition)
router.get(GET_POSITION_BY_ID, handleGetPositionById)

export default router
