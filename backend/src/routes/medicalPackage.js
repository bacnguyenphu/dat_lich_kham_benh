const express = require('express')
const { handleCreateMedicalPackage, handleGetMedicalPackage, 
    handleGetMedicalPackageById, 
    handleUpdateMedicalPackage} = require('../controllers/medicalPackageController')
const router = express.Router()

router.post('/create-medical-package',handleCreateMedicalPackage)
router.put('/update-medical-package',handleUpdateMedicalPackage)
router.get('/get-medical-package',handleGetMedicalPackage)
router.get('/get-medical-package-by-id',handleGetMedicalPackageById)

export default router