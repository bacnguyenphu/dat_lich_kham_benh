import { handleCreateDoctor, handleGetDoctors } from '../controllers/doctorController'

const express = require('express')
const router = express.Router()

router.post('/create-doctor',handleCreateDoctor)
router.get('/get-doctors',handleGetDoctors)

export default router