const express = require('express')
const router = express.Router()

import { handleInsertSpecialty,handleInsertCategoryPackage} from '../controllers/insertController'

router.get('/insertSpecialty',handleInsertSpecialty)
router.get("/insertCategoryPackage",handleInsertCategoryPackage)

export default router