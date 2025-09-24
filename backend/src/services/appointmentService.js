import db from '../models/index'
import time_frame from '../models/time_frame'

const getInfoToMakeAppointment = async (data) => {
    try {
        console.log("check data>>>",data);
        
        if (!data?.idDoctor && !data?.idMedicalPackage) {
            return {
                err: 1,
                message: "ID doctor or medical package is required !"
            }
        }
        if (!data.appointment_date) {
            return {
                err: 2,
                message: "Appoinment date is required !"
            }
        }
        if (!time_frame) {
            return {
                err: 3,
                message: "time_frame is required !"
            }
        }

        const doctor = await db.Doctor.findOne({
            where: { id: data?.idDoctor },
            attributes: ['id', 'description', 'price',],
            include: [
                { model: db.User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'avatar'] },
                { model: db.Position, as: 'position', attributes: ['name', 'id'], through: { attributes: [] } },
            ]
        })

        const timeFrame = await db.Time_frame.findOne({
            where: { id: data?.time_frame }
        })

        return {
            err: 0,
            message: "Get success !",
            data: {
                doctor,
                time_frame: timeFrame.time_frame,
                appointment_date: data?.appointment_date
            }
        }

    } catch (error) {
        console.log("Lỗi ở getInfoToMakeAppointment :", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}



export { getInfoToMakeAppointment }