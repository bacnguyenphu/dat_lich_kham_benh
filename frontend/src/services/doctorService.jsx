import axios from '../utils/customAxios'

const createDoctor = async(payload)=>{
    return axios.post('create-doctor',payload)
}

const getDoctors = async()=>{
    return axios.get('get-doctors')
}

export{createDoctor,getDoctors}