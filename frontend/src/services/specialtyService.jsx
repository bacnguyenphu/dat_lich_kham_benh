import axios from "../utils/customAxios";

const getSpecialties = (limit, page) => {
    return axios.get("get-specialties", { params: { limit, page } })
}

const createSpecialty = (payload) => {
    // console.log(payload);
    return axios.post("create-specialty", payload)
}

const deleteSpecialty = (id) => {
    return axios.delete("delete-specialty", { params: { id } })
}

const getSpecialtyById = (id) => {
    return axios.get("get-specialty-by-id", { params: { id } })
}

const updateSpecialty = (payload)=>{
    return axios.post("update-specialty", payload)
}

export { getSpecialties, createSpecialty, deleteSpecialty, getSpecialtyById,updateSpecialty }