const express = require('express')
const { handleGetCategoryPackage, handleGetCategoryPackageById,
    handleCreateCreateCategoryPackage, handleUpdateCategoryPackage,
    handelDeleteCategoryPackage } = require('../controllers/categoryPackageController')
const router = express.Router()

router.get('/get-category-package', handleGetCategoryPackage)
router.get('/get-category-package-by-id', handleGetCategoryPackageById)
router.post('/create-category-package', handleCreateCreateCategoryPackage)
router.put('/update-category-package', handleUpdateCategoryPackage)
router.delete('/delete-category-package', handelDeleteCategoryPackage)

export default router