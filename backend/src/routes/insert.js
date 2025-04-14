const express = require('express')
const router = express.Router()

import { handleInsertSpecialty } from '../controllers/insertController'

router.get('/insertSpecialty',handleInsertSpecialty)

export default router