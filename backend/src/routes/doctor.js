import { handleCreateDoctor, handleDeleteDoctorById, handleGetDoctorById, handleGetDoctors } from '../controllers/doctorController'

const express = require('express')
const router = express.Router()

router.post('/create-doctor',handleCreateDoctor)
router.get('/get-doctors',handleGetDoctors)
router.get('/get-doctors-by-id',handleGetDoctorById)
router.delete('/delete-doctor-by-id',handleDeleteDoctorById)

export default router