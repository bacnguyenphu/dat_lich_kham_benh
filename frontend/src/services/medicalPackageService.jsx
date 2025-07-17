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

export { createMedicalPackage, getMedicalPackage, getMedicalPackageById, updateMedicalPackage }