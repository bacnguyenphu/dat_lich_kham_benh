import { handleCreatePosition, handleDeletePosition, handleGetPositionById, handleGetPositions, handleUpdatePosition } from '../controllers/positionController'
import { CREATE_POSITION, DELETE_POSITION, GET_POSITION_BY_ID, GET_POSITIONS, UPDATE_POSITION } from '../utils/routeUrlApi'

const express = require('express')
const router = express.Router()

router.get(GET_POSITIONS, handleGetPositions)
router.post(CREATE_POSITION, handleCreatePosition)
router.delete(DELETE_POSITION, handleDeletePosition)
router.put(UPDATE_POSITION, handleUpdatePosition)
router.get(GET_POSITION_BY_ID, handleGetPositionById)

export default router
