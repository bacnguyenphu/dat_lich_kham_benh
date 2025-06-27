import axios from '../utils/customAxios'

const createOrUpdateSchedule = (payload)=>{
    // console.log('check payload: ',payload);
    return axios.post('create-or-update-schedule',payload)
}
const getScheduleFollowDate = (id_doctor,appointment_date)=>{
    return axios.get("get-schedule-follow-date",{params:{id_doctor,appointment_date}})    
}

export{createOrUpdateSchedule,getScheduleFollowDate}