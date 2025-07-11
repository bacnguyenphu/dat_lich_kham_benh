import { getPositions, createPosition, deletePosition, updatePosition, getPositionById } from "../services/positionsService";

const handleGetPositions = async (req, res) => {
    try {
        let limit = req.query.limit
        let page = req.query.page
        const message = await getPositions(+limit, +page)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleGetPositions", error);

    }
}

const handleCreatePosition = async (req, res) => {
    try {
        let data = req.body
        const message = await createPosition(data)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleCreatePosition", error);
    }
}

const handleDeletePosition = async (req, res) => {
    try {
        let id = req.query.id
        const message = await deletePosition(id)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleDeletePosition", error);
    }
}

const handleUpdatePosition = async (req, res) => {
    try {
        let data = req.body
        const message = await updatePosition(data)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleUpdatePosition !", error);

    }
}

const handleGetPositionById = async (req, res) => {
    try {
        let id = req.query.id
        const message = await getPositionById(id)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleGetPositionById !", error);
    }
}

export { handleGetPositions, handleCreatePosition, handleDeletePosition, handleUpdatePosition, handleGetPositionById }