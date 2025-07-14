import axios from '../utils/customAxios'

const getCategoryPackage = (limit,page)=>{
    return axios.get("get-category-package",{params:{limit,page}})
}

const getCategoryPackageById = (id)=>{
    return axios.get("get-category-package-by-id",{params:{id}})
}

const createCategoryPackage = (data)=>{
    return axios.post('create-category-package',data)
}

export {getCategoryPackage,createCategoryPackage}