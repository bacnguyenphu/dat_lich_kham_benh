import { handleCheckAdmin } from '../controllers/authController'
import { checkUserJWT } from '../middleware/JWTaction'
import {
    CREATE_MEDICAL_PACKAGE, DELETE_MEDICAL_PACKAGE, GET_MEDICAL_PACKAGE, GET_MEDICAL_PACKAGE_BY_ID,
    GET_MEDICAL_PACKAGE_FOLLOW_CATEGORY, UPDATE_MEDICAL_PACKAGE
} from '../utils/routeUrlApi'

const express = require('express')
const { handleCreateMedicalPackage, handleGetMedicalPackage,
    handleGetMedicalPackageById,
    handleUpdateMedicalPackage,
    handleDeleteMedicalPackage,
    handleGetMedicalPackageFollowCategory } = require('../controllers/medicalPackageController')
const router = express.Router()

router.post(CREATE_MEDICAL_PACKAGE, checkUserJWT, handleCheckAdmin, handleCreateMedicalPackage)
router.put(UPDATE_MEDICAL_PACKAGE, handleUpdateMedicalPackage)
router.get(GET_MEDICAL_PACKAGE, handleGetMedicalPackage)
router.get(GET_MEDICAL_PACKAGE_BY_ID, handleGetMedicalPackageById)
router.delete(DELETE_MEDICAL_PACKAGE, checkUserJWT, handleCheckAdmin, handleDeleteMedicalPackage)
router.get(GET_MEDICAL_PACKAGE_FOLLOW_CATEGORY, handleGetMedicalPackageFollowCategory)

export default router