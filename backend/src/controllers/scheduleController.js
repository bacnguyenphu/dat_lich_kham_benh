import { createOrUpdateSchedule, getScheduleFollowDate, getScheduleOfDoctor } from "../services/scheduleService";

const handleCreateOrUpdateSchedule = async (req, res) => {
    try {
        const data = req.body
        const message = await createOrUpdateSchedule(data)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handlecreateOrUpdateSchedule: ", error);

    }
}

const handleGetScheduleFollowDate = async (req, res) => {
    try {
        const id_doctor = req.query.id_doctor
        const idMedicalPackage = req.query.idMedicalPackage
        const appointment_date = req.query.appointment_date

        const message = await getScheduleFollowDate({ id_doctor, idMedicalPackage, appointment_date })
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleGetScheduleFollowDate :", error);

    }
}

const handleGetScheduleOfDoctor = async (req, res) => {
    try {
        const idDoctor = req.query.idDoctor

        const message = await getScheduleOfDoctor(idDoctor)
        return res.status(200).json(message)

    } catch (error) {
        console.log("Lỗi ở handleGetScheduleOfDoctor :", error);
    }
}

export { handleCreateOrUpdateSchedule, handleGetScheduleFollowDate, handleGetScheduleOfDoctor }