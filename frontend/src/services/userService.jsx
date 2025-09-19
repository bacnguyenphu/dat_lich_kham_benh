import axios from '../utils/customAxios'

const getUsers = (limit, page) => {
    return axios.get('get-users', { params: { limit, page } })
}

const getUserById = (idUser) => {
    return axios.get("get-user-by-id", { params: { idUser } })
}

const updateUser = (payload) => {
    return axios.post("update-user", payload)
}

const deleteUserById = (idUser) => {
    return axios.delete("delete-user", { params: { idUser } })
}

export { getUsers, getUserById, updateUser, deleteUserById }