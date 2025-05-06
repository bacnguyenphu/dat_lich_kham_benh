import axios from '../utils/customAxios'

const getCategoryPackage = (limit)=>{
    return axios.get("get-category-package",{params:{limit}})
}

export {getCategoryPackage}