import axios from '../utils/customAxios'

const createOrUpdateSchedule = (payload)=>{
    // console.log('check payload: ',payload);
    return axios.post('create-or-update-schedule',payload)
}
const getScheduleFollowDate = (data)=>{
    console.log(data);
    
    return axios.get("get-schedule-follow-date",{params:data})    
}

export{createOrUpdateSchedule,getScheduleFollowDate}