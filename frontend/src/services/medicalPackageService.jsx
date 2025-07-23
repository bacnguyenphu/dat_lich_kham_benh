import axios from '../utils/customAxios'

const createMedicalPackage = (data) => {
    return axios.post('create-medical-package', data)
}

const updateMedicalPackage = (data) => {
    return axios.put('update-medical-package', data)
}

const getMedicalPackage = (limit, page) => {
    return axios.get('get-medical-package', { params: { limit, page } })
}

const getMedicalPackageById = (id) => {
    return axios.get('get-medical-package-by-id', { params: { id } })
}

const deleteMedicalPackage = (id) => {
    return axios.delete('delete-medical-package', { params: { id } })
}

const getMedicalPackageFollowCategory = (data)=>{
    return axios.get('get-medical-package-follow-category',{ params: data })
}

export { createMedicalPackage, getMedicalPackage, getMedicalPackageById, 
    updateMedicalPackage, deleteMedicalPackage, getMedicalPackageFollowCategory }