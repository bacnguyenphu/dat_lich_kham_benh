const express = require("express");
const {
  GET_PATIENTS_BY_ID_USER,
  GET_PATIENTS,
} = require("../utils/routeUrlApi");
const {
  handleGetPatientsByIdUser,
  handleGetPatients,
} = require("../controllers/patientController");
const router = express.Router();

router.get(GET_PATIENTS_BY_ID_USER, handleGetPatientsByIdUser);
router.get(GET_PATIENTS, handleGetPatients);

export default router;
