import axios from '../utils/customAxios'

const createOrUpdateSchedule = (payload)=>{
    console.log('check payload: ',payload);
    return axios.post('create-or-update-schedule',payload)
}
const getScheduleFollowDate = (id_doctor,appointment_date)=>{
    console.log(new Date(appointment_date).toISOString().slice(0, 10));
    
    return axios.get("get-schedule-follow-date",{params:{id_doctor,appointment_date}})    
}

export{createOrUpdateSchedule,getScheduleFollowDate}