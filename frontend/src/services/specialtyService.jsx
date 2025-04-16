import axios from "../utils/customAxios";

const getSpecialties = (limit)=>{
    return axios.get("get-specialties",{params:{limit}})
}

export {getSpecialties}