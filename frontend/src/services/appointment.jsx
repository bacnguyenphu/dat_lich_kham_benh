import axios from "../utils/customAxios";

const getInfoToMakeAppointment = (payload) => {
  return axios.get("get-info-make-appointment", { params: { ...payload } });
};

const createAppointment = (payload) => {
  return axios.post("create-appointment", payload);
};

const getAppointmentOfUser = (idUser, limit, page) => {
  return axios.get("get-appointment-of-user", {
    params: { idUser, limit, page },
  });
};

const getAppointmetOfPatient = (idPatient, limit, page) => {
  return axios.get("get-appointment-of-patient", {
    params: { idPatient, limit, page },
  });
};

const updateStatusAppointment = (idAppointment, status) => {
  return axios.put(
    "update-status-appointment",
    {},
    { params: { idAppointment, status } },
  );
};

const getAppointments = (
  idDoctor,
  limit,
  page,
  value,
  filter,
  date,
  isCheckIn,
) => {
  return axios.get("get-appointments", {
    params: { idDoctor, limit, page, value, filter, date, isCheckIn },
  });
};

const getAppointmentById = (id) => {
  return axios.get("get-appointment-by-id", { params: { id } });
};

const paymentConfirmation = (id) => {
  return axios.put("payment-confirmation", {}, { params: { id } });
};

const checkInConfirmation = (idAppointment, isCheckIn) => {
  return axios.post("check-in-confirmation", { idAppointment, isCheckIn });
};

export {
  getInfoToMakeAppointment,
  createAppointment,
  getAppointmentOfUser,
  updateStatusAppointment,
  getAppointments,
  getAppointmentById,
  paymentConfirmation,
  checkInConfirmation,
  getAppointmetOfPatient,
};
