const { getSpecialties, createSchedule, deleteSpecialty, getSpecialtyById, updateSpecialty } = require("../services/specialtyServices");

const handleGetSpecialties = async (req, res) => {
    try {
        let limit = req.query.limit
        let page = req.query.page
        const message = await getSpecialties(+limit, +page)
        return res.status(200).json(message)

    } catch (error) {
        console.log("Lỗi ở handleGetSpecialies: ", error);

    }
}

const handleCreateSpecialty = async (req, res) => {
    try {
        let data = req.body
        const message = await createSchedule(data)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lối ở handleCreateSpecialty !");

    }
}

const handleDeleteSpecialty = async (req, res) => {
    try {
        let id = req.query.id
        const message = await deleteSpecialty(id)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleDeleteSpecialty !", error);

    }
}

const handleGetSpecialtyById = async (req, res) => {
    try {
        let id = req.query.id
        const message = await getSpecialtyById(id)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleGetSpecialtyById !", error);

    }
}

const handleUpdateSpecialty = async (req, res) => {
    try {
        let data = req.body
        const message = await updateSpecialty(data)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleUpdateSpecialty: ", error);

    }
}

export { handleGetSpecialties, handleCreateSpecialty, handleDeleteSpecialty, handleGetSpecialtyById, handleUpdateSpecialty }