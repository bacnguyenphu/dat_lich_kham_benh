const express = require("express");
const { GET_PATIENTS_BY_ID_USER } = require("../utils/routeUrlApi");
const {
  handleGetPatientsByIdUser,
} = require("../controllers/patientController");
const router = express.Router();

router.get(GET_PATIENTS_BY_ID_USER, handleGetPatientsByIdUser);

export default router;
