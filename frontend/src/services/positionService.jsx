import { data } from "react-router-dom";
import axios from "../utils/customAxios";

const getPostions = async (limit, page) => {
    return axios.get('get-postions', { params: { limit, page } })
}

const createPosition = async(data)=>{
    // console.log(data);
    
    return axios.post('create-position',data)
    
}

const deletePosition = async(id)=>{
    return axios.delete('delete-position',{params:{id}})
}

export { getPostions,createPosition,deletePosition }