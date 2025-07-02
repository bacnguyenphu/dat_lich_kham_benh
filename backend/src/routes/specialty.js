const { handleGetSpecialties, handleCreateSpecialty, handleDeleteSpecialty, handleGetSpecialtyById, handleUpdateSpecialty } = require('../controllers/specialtyController')
const express = require('express')
const router = express.Router()

router.get('/get-specialties',handleGetSpecialties)
router.post('/create-specialty',handleCreateSpecialty)
router.post('/update-specialty',handleUpdateSpecialty)
router.delete('/delete-specialty',handleDeleteSpecialty)
router.get('/get-specialty-by-id',handleGetSpecialtyById)

export default router