import { handleCheckAdmin } from '../controllers/authController'
import { checkUserJWT } from '../middleware/JWTaction'

const express = require('express')
const { handleGetCategoryPackage, handleGetCategoryPackageById,
    handleCreateCreateCategoryPackage, handleUpdateCategoryPackage,
    handelDeleteCategoryPackage } = require('../controllers/categoryPackageController')
const router = express.Router()

router.get('/get-category-package', handleGetCategoryPackage)
router.get('/get-category-package-by-id', handleGetCategoryPackageById)
router.post('/create-category-package', checkUserJWT, handleCheckAdmin, handleCreateCreateCategoryPackage)
router.put('/update-category-package', checkUserJWT, handleCheckAdmin, handleUpdateCategoryPackage)
router.delete('/delete-category-package', checkUserJWT, handleCheckAdmin, handelDeleteCategoryPackage)

export default router