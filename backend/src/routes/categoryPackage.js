const express = require('express')
const { handleGetCategoryPackage, handleCreateCreatePackage, handleGetCategoryPackageById } = require('../controllers/categoryPackageController')
const router = express.Router()

router.get('/get-category-package', handleGetCategoryPackage)
router.get('/get-category-package-by-id', handleGetCategoryPackageById)
router.post('/create-category-package', handleCreateCreatePackage)

export default router