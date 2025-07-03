import { handleCreateDoctor, handleDeleteDoctorById, handleGetDoctorById, handleGetDoctorFollowSpecialty, handleGetDoctors, handleUpdateDoctor } from '../controllers/doctorController'

const express = require('express')
const router = express.Router()

router.post('/create-doctor',handleCreateDoctor)
router.get('/get-doctors',handleGetDoctors)
router.get('/get-doctors-by-id',handleGetDoctorById)
router.delete('/delete-doctor-by-id',handleDeleteDoctorById)
router.put('/update-doctor',handleUpdateDoctor)
router.get('/get-doctor-follow-specialty',handleGetDoctorFollowSpecialty)

export default router