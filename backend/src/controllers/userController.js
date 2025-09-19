const { getUsers, getUserById, updateUser, deleteUserById } = require("../services/userService");

const handleGetUsers = async (req, res) => {
    try {
        const limit = req.query.limit
        const page = req.query.page
        const message = await getUsers(+limit, +page)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleGetUsers: ", error);
    }
}

const handleGetUserById = async (req, res) => {
    try {
        const id = req.query.idUser
        const message = await getUserById(id)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleGetUserById: ", error);
    }
}

const handleUpdateUser = async(req,res)=>{
    try {
        const data = req.body
        const message = await updateUser(data)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleGetUserById: ", error);
    }
}

const handleDeleteUserById = async(req,res)=>{
    try {
        const id = req.query.idUser
        const message = await deleteUserById(id)
        return res.status(200).json(message)
    } catch (error) {
         console.log("Lỗi ở handleDeleteUserById: ", error);
    }
}

export { handleGetUsers, handleGetUserById, handleUpdateUser, handleDeleteUserById }