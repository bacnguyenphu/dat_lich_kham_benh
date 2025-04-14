const express = require('express')
const { handleGetSpecialties } = require('../controllers/specialtyController')
const router = express.Router()

router.get('/get-specialties',handleGetSpecialties)

export default router