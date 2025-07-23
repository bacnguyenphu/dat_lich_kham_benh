import axios from '../utils/customAxios'

const createDoctor = async (payload) => {
    return axios.post('create-doctor', payload)
}

const getDoctors = async (limit, page) => {
    return axios.get('get-doctors', { params: { limit, page } })
}

const getDoctorById = async (idDoctor) => {
    return axios.get('get-doctors-by-id', { params: { idDoctor } })
}

const deleteDoctorById = (idDoctor) => {
    return axios.delete('delete-doctor-by-id', { params: { idDoctor } })
}

const updateDoctor = (data) => {
    return axios.put('update-doctor', data)
}

const getDoctorFollowSpecialty = (id, limit, page) => {
    return axios.get("get-doctor-follow-specialty", { params: { id, limit, page } })
}

export { createDoctor, getDoctors, getDoctorById, deleteDoctorById, updateDoctor, getDoctorFollowSpecialty }