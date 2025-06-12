import axios from '../utils/customAxios'

const createOrUpdateSchedule = (payload)=>{
    console.log('check payload: ',payload);
    return axios.post('create-or-update-schedule',payload)
}

export{createOrUpdateSchedule}