import axios from "../utils/customAxios";

const getPatientsByIdUser = (idUser) => {
  return axios.get("get-patients-by-id-user", { params: { idUser } });
};

const getPatients = (limit, page, value) => {
  return axios.get("get-patients", { params: { limit, page, value } });
};

const getAllPatient = () => {
  return axios.get("get-all-patient");
};

export { getPatientsByIdUser, getPatients, getAllPatient };
