const express = require('express')
const { handleCreateMedicalPackage } = require('../controllers/medicalPackageController')
const router = express.Router()

router.post('/create-medical-package',handleCreateMedicalPackage)

export default router