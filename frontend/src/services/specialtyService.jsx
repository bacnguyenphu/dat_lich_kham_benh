import axios from "../utils/customAxios";

const getSpecialties = (limit,page)=>{
    return axios.get("get-specialties",{params:{limit,page}})
}



export {getSpecialties}