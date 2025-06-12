import { createOrUpdateSchedule } from "../services/scheduleService";

const handleCreateOrUpdateSchedule = async (req, res) => {
    try {
        const data = req.body
        const message = await createOrUpdateSchedule(data)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handlecreateOrUpdateSchedule: ", error);

    }
}

export { handleCreateOrUpdateSchedule }