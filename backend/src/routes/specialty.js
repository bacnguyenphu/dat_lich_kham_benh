const { handleGetSpecialties, handleCreateSpecialty, handleDeleteSpecialty, handleGetSpecialtyById } = require('../controllers/specialtyController')
const express = require('express')
const router = express.Router()

router.get('/get-specialties',handleGetSpecialties)
router.post('/create-specialty',handleCreateSpecialty)
router.delete('/delete-specialty',handleDeleteSpecialty)
router.get('/get-specialty-by-id',handleGetSpecialtyById)

export default router