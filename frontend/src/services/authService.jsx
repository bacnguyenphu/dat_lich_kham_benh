import axios from "../utils/customAxios";

const login = (data)=>{
    return axios.post('login',data)
}

const register = (data)=>{
    return axios.post('register',data)
}

export {login, register}