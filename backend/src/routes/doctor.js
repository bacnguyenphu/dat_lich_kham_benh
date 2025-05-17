import { handleCreateDoctor } from '../controllers/doctorController'

const express = require('express')
const router = express.Router()

router.post('/create-doctor',handleCreateDoctor)

export default router