import axios from "../utils/customAxios";

const getPatientsByIdUser = (idUser) => {
  return axios.get("get-patients-by-id-user", { params: { idUser } });
};

const getPatients = (limit, page, value) => {
  return axios.get("get-patients", { params: { limit, page, value } });
};

export { getPatientsByIdUser, getPatients };
