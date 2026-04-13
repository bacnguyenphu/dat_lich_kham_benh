const express = require("express");
const {
  GET_PATIENTS_BY_ID_USER,
  GET_PATIENTS,
  GET_ALL_PATIENT,
} = require("../utils/routeUrlApi");
const {
  handleGetPatientsByIdUser,
  handleGetPatients,
  handleGetAllPatient,
} = require("../controllers/patientController");
const router = express.Router();

router.get(GET_PATIENTS_BY_ID_USER, handleGetPatientsByIdUser);
router.get(GET_PATIENTS, handleGetPatients);
router.get(GET_ALL_PATIENT, handleGetAllPatient);

export default router;
