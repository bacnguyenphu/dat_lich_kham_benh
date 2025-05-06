const express = require('express')
const { handleGetCategoryPackage } = require('../controllers/categoryPackageCo')
const router = express.Router()

router.get('/get-category-package',handleGetCategoryPackage)

export default router