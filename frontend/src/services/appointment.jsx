import axios from "../utils/customAxios";

const getInfoToMakeAppointment = (payload) => {
    return axios.get('get-info-make-appointment', { params: { ...payload } })
}

const createAppointment = (payload) => {

    return axios.post("create-appointment", payload)
}

const getAppointmentOfUser = (idUser, limit, page) => {
    return axios.get("get-appointment-of-user", { params: { idUser, limit, page } })
}

const updateStatusAppointment = (idAppointment, status) => {
    return axios.put("update-status-appointment", {}, { params: { idAppointment, status } })
}

export { getInfoToMakeAppointment, createAppointment, getAppointmentOfUser, updateStatusAppointment }