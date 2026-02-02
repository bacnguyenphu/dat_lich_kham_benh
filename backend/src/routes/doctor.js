import {
    handleCreateDoctor, handleDeleteDoctorById, handleGetAppointmentOfUserFollowDoctor, handleGetDoctorById,
    handleGetDoctorFollowSpecialty, handleGetDoctors, handleGetPatientOfDoctor,
    handleUpdateDoctor
} from '../controllers/doctorController'
import { CREATE_DOCTOR, DELETE_DOCTORS_BY_ID, GET_APPOINTMENT_OF_USER_FOLLOW_DOCTOR, GET_DOCTOR_FOLLOW_SPECIALTY, GET_DOCTORS, GET_DOCTORS_BY_ID, GET_PATIENT_OF_DOCTOR, UPDATE_DOCTOR } from '../utils/routeUrlApi'

const express = require('express')
const router = express.Router()
router.post(CREATE_DOCTOR, handleCreateDoctor)
router.get(GET_DOCTORS, handleGetDoctors)
router.get(GET_DOCTORS_BY_ID, handleGetDoctorById)
router.delete(DELETE_DOCTORS_BY_ID, handleDeleteDoctorById)
router.put(UPDATE_DOCTOR, handleUpdateDoctor)
router.get(GET_DOCTOR_FOLLOW_SPECIALTY, handleGetDoctorFollowSpecialty)
router.get(GET_PATIENT_OF_DOCTOR, handleGetPatientOfDoctor)
router.get(GET_APPOINTMENT_OF_USER_FOLLOW_DOCTOR, handleGetAppointmentOfUserFollowDoctor)

export default router