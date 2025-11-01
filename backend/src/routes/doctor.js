import { handleCheckAdmin } from '../controllers/authController'
import { handleCreateDoctor, handleDeleteDoctorById, handleGetDoctorById, handleGetDoctorFollowSpecialty, handleGetDoctors, handleGetPatientOfDoctor, handleUpdateDoctor } from '../controllers/doctorController'
import { checkUserJWT } from '../middleware/JWTaction'

const express = require('express')
const router = express.Router()

router.post('/create-doctor',checkUserJWT,handleCheckAdmin,handleCreateDoctor)
router.get('/get-doctors',handleGetDoctors)
router.get('/get-doctors-by-id',handleGetDoctorById)
router.delete('/delete-doctor-by-id',checkUserJWT,handleCheckAdmin,handleDeleteDoctorById)
router.put('/update-doctor',handleUpdateDoctor)
router.get('/get-doctor-follow-specialty',handleGetDoctorFollowSpecialty)
router.get('/get-patient-of-doctor',handleGetPatientOfDoctor)

export default router