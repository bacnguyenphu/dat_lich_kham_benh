const express = require('express')
const { handleCreateMedicalPackage, handleGetMedicalPackage, 
    handleGetMedicalPackageById, 
    handleUpdateMedicalPackage,
    handleDeleteMedicalPackage} = require('../controllers/medicalPackageController')
const router = express.Router()

router.post('/create-medical-package',handleCreateMedicalPackage)
router.put('/update-medical-package',handleUpdateMedicalPackage)
router.get('/get-medical-package',handleGetMedicalPackage)
router.get('/get-medical-package-by-id',handleGetMedicalPackageById)
router.delete('/delete-medical-package',handleDeleteMedicalPackage)

export default router