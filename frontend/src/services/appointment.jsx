import axios from "../utils/customAxios";

const getInfoToMakeAppointment = (payload) => {
    return axios.get('get-info-make-appointment', { params: { ...payload } })
}

export { getInfoToMakeAppointment }