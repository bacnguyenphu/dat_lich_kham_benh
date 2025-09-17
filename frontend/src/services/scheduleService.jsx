import axios from '../utils/customAxios'

const createOrUpdateSchedule = (payload) => {
    // console.log('check payload: ',payload);
    return axios.post('create-or-update-schedule', payload)
}
const getScheduleFollowDate = (data) => {
    return axios.get("get-schedule-follow-date", { params: data })
}

const getScheduleOfDoctor = (idDoctor) => {
    return axios.get("get-schedule-of-doctor", { params: {idDoctor} })
}

export { createOrUpdateSchedule, getScheduleFollowDate, getScheduleOfDoctor }