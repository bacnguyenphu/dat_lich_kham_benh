import axios from '../utils/customAxios'

const createDoctor = async(payload)=>{
    // console.log(payload);
    return axios.post('create-doctor',payload)
}

export{createDoctor}