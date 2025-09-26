import axios from "../utils/customAxios";

const getInfoToMakeAppointment = (payload) => {
    return axios.get('get-info-make-appointment', { params: { ...payload } })
}

const createAppointment = (payload) => {
    
    return axios.post("create-appointment", payload)
}

export { getInfoToMakeAppointment,createAppointment }