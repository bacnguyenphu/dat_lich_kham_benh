import axios from '../utils/customAxios'

const createMedicalPackage = (data)=>{
    return axios.post('create-medical-package',data)
}

export{createMedicalPackage}