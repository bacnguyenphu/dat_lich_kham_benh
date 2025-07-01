const { handleGetSpecialties, handleCreateSpecialty } = require('../controllers/specialtyController')
const express = require('express')
const router = express.Router()

router.get('/get-specialties',handleGetSpecialties)
router.post('/create-specialty',handleCreateSpecialty)

export default router