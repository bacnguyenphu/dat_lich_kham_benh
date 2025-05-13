import axios from "../utils/customAxios";

const getPostions = async()=>{
    return axios.get('get-postions')
}

export{getPostions}