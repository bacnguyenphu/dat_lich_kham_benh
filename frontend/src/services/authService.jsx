import axios from "../utils/customAxios";

const login = (data) => {
    return axios.post('login', data)
}

const register = (data) => {
    return axios.post('register', data)
}

const logout = () => {
    return axios.post("logout")
}

const requestNavigateAdmin = () => {
    return axios.get("navigate-admin")
}

const loginDoctor = (data) => {
    return axios.post('login-doctor', data)
}

const changePasswordDoctor = (data) => {
    return axios.post('change-password-doctor', data)
}

export {
    login, register, logout, requestNavigateAdmin,
    loginDoctor, changePasswordDoctor
}