import { handleCheckAdmin } from '../controllers/authController'
import { checkUserJWT } from '../middleware/JWTaction'

const { handleGetSpecialties, handleCreateSpecialty, handleDeleteSpecialty, handleGetSpecialtyById, handleUpdateSpecialty } = require('../controllers/specialtyController')
const express = require('express')
const router = express.Router()

router.get('/get-specialties',handleGetSpecialties)
router.post('/create-specialty',checkUserJWT,handleCheckAdmin,handleCreateSpecialty)
router.post('/update-specialty',checkUserJWT,handleCheckAdmin,handleUpdateSpecialty)
router.delete('/delete-specialty',handleDeleteSpecialty)
router.get('/get-specialty-by-id',handleGetSpecialtyById)

export default router