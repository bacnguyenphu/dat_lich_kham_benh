import axios from '../utils/customAxios'

const search = (value,filter)=>{
    return axios.get("search",{params:{value,filter}})
}

export {search}