const express = require('express')
const { handleCreateMedicalPackage, handleGetMedicalPackage, 
    handleGetMedicalPackageById, 
    handleUpdateMedicalPackage,
    handleDeleteMedicalPackage,
    handleGetMedicalPackageFollowCategory} = require('../controllers/medicalPackageController')
const router = express.Router()

router.post('/create-medical-package',handleCreateMedicalPackage)
router.put('/update-medical-package',handleUpdateMedicalPackage)
router.get('/get-medical-package',handleGetMedicalPackage)
router.get('/get-medical-package-by-id',handleGetMedicalPackageById)
router.delete('/delete-medical-package',handleDeleteMedicalPackage)
router.get('/get-medical-package-follow-category',handleGetMedicalPackageFollowCategory)

export default router