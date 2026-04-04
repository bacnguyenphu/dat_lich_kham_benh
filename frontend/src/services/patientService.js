import axios from "../utils/customAxios";

const getPatientsByIdUser = (idUser) => {
  return axios.get("get-patients-by-id-user", { params: { idUser } });
};

export { getPatientsByIdUser };
