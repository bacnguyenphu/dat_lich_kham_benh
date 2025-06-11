const { handleGetSpecialties } = require('../controllers/specialtyController')
const express = require('express')
const router = express.Router()

router.get('/get-specialties',handleGetSpecialties)

export default router