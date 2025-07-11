import axios from "../utils/customAxios";

const getPostions = async (limit, page) => {
    return axios.get('get-postions', { params: { limit, page } })
}

const createPosition = async (data) => {
    return axios.post('create-position', data)
}

const deletePosition = async (id) => {
    return axios.delete('delete-position', { params: { id } })
}

const getPositionById = async (id) => {
    return axios.get('get-position-by-id', { params: { id } })
}

const updatePosition = async (data) => {
    return axios.put('update-position', data)
}

export { getPostions, createPosition, deletePosition, getPositionById, updatePosition }