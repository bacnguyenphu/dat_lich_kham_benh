import { handleCreateDoctor, handleDeleteDoctorById, handleGetDoctorById, handleGetDoctors, handleUpdateDoctor } from '../controllers/doctorController'

const express = require('express')
const router = express.Router()

router.post('/create-doctor',handleCreateDoctor)
router.get('/get-doctors',handleGetDoctors)
router.get('/get-doctors-by-id',handleGetDoctorById)
router.delete('/delete-doctor-by-id',handleDeleteDoctorById)
router.put('/update-doctor',handleUpdateDoctor)

export default router