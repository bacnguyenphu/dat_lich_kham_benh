import axios from "../utils/customAxios";

const getSpecialties = (limit,page)=>{
    return axios.get("get-specialties",{params:{limit,page}})
}

const createSpecialty = (payload)=>{
    // console.log(payload);
    return axios.post("create-specialty",payload)
}

export {getSpecialties,createSpecialty}