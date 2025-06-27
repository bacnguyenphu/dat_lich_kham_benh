import { createOrUpdateSchedule, getScheduleFollowDate } from "../services/scheduleService";

const handleCreateOrUpdateSchedule = async (req, res) => {
    try {
        const data = req.body
        const message = await createOrUpdateSchedule(data)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handlecreateOrUpdateSchedule: ", error);

    }
}

const handleGetScheduleFollowDate = async(req,res)=>{
    try {
        const id_doctor = req.query.id_doctor
        const appointment_date = req.query.appointment_date
        console.log('check query : ',id_doctor,"   ",appointment_date);
        
        const message = await getScheduleFollowDate({id_doctor,appointment_date})
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleGetScheduleFollowDate :",error);
        
    }
}

export { handleCreateOrUpdateSchedule,handleGetScheduleFollowDate }