import { CREATE_CATEGORY_PACKAGE, DELETE_CATEGORY_PACKAGE, GET_CATEGORY_PACKAGE, GET_CATEGORY_PACKAGE_BY_ID, UPDATE_CATEGORY_PACKAGE } from '../utils/routeUrlApi'

const express = require('express')
const { handleGetCategoryPackage, handleGetCategoryPackageById,
    handleCreateCreateCategoryPackage, handleUpdateCategoryPackage,
    handelDeleteCategoryPackage } = require('../controllers/categoryPackageController')
const router = express.Router()

router.get(GET_CATEGORY_PACKAGE, handleGetCategoryPackage)
router.get(GET_CATEGORY_PACKAGE_BY_ID, handleGetCategoryPackageById)
router.post(CREATE_CATEGORY_PACKAGE, handleCreateCreateCategoryPackage)
router.put(UPDATE_CATEGORY_PACKAGE, handleUpdateCategoryPackage)
router.delete(DELETE_CATEGORY_PACKAGE, handelDeleteCategoryPackage)

export default router