import axios from '../utils/customAxios'

const getCategoryPackage = (limit, page) => {
    return axios.get("get-category-package", { params: { limit, page } })
}

const getCategoryPackageById = (id) => {
    return axios.get("get-category-package-by-id", { params: { id } })
}

const createCategoryPackage = (data) => {
    return axios.post('create-category-package', data)
}

const updateCategoryPackage = (data) => {
    return axios.put('update-category-package', data)
}

const deleteCategoryPackage = (id) => {
    return axios.delete('delete-category-package', { params: { id } })
}

export { getCategoryPackage, createCategoryPackage, getCategoryPackageById, updateCategoryPackage, deleteCategoryPackage }