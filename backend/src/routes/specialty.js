import { handleCheckAdmin } from '../controllers/authController'
import { checkUserJWT } from '../middleware/JWTaction'
import { CREATE_SPECIALTY, DELETE_SPECIALTY, GET_SPECIALTIES, GET_SPECIALTY_BY_ID, UPDATE_SPECIALTY } from '../utils/routeUrlApi'

const { handleGetSpecialties, handleCreateSpecialty, handleDeleteSpecialty, handleGetSpecialtyById, handleUpdateSpecialty } = require('../controllers/specialtyController')
const express = require('express')
const router = express.Router()

router.get(GET_SPECIALTIES, handleGetSpecialties)
router.post(CREATE_SPECIALTY, checkUserJWT, handleCheckAdmin, handleCreateSpecialty)
router.post(UPDATE_SPECIALTY, checkUserJWT, handleCheckAdmin, handleUpdateSpecialty)
router.delete(DELETE_SPECIALTY, handleDeleteSpecialty)
router.get(GET_SPECIALTY_BY_ID, handleGetSpecialtyById)

export default router