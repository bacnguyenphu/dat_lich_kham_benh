import { col, fn, Op, where } from 'sequelize';
import db from '../models/index'
import time_frame from '../models/time_frame'
import { v4 as uuidv4 } from 'uuid';

const getInfoToMakeAppointment = async (data) => {
    try {
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

const createAppointment = async (data) => {
    try {
        if (!data.idDoctor && !data.idMedicalPackage) {
            return {
                err: 1,
                message: "ID doctor or medical package is required !"
            }
        }
        if (!data.appointment_date) {
            return {
                err: 2,
                message: "Appoinment is required !"
            }
        }
        if (!data.idPatient) {
            return {
                err: 3,
                message: "ID patient is required !"
            }
        }
        if (!data.time_frame) {
            return {
                err: 4,
                message: "Time is required !"
            }
        }

        const appointment = await db.Appointment.findOne({
            where: {
                id_patient: data?.idPatient,
                time: data?.time_frame,
                [Op.and]: where(fn("DATE", col("appointment_date")), "=", data?.appointment_date)
            }
        })

        if (appointment) {
            return {
                err: 5,
                message: "Cannot register because you have a duplicate appointment."
            }
        }

        await db.Appointment.create({
            id: uuidv4(),
            id_doctor: data?.idDoctor,
            id_patient: data?.idPatient,
            id_medical_package: data?.idMedicalPackage,
            appointment_date: data?.appointment_date,
            time: data?.time_frame,
        })

        return {
            err: 0,
            message: "Create appointment success !"
        }

    } catch (error) {
        console.log("Lỗi ở getInfoToMakeAppointment :", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

const getAppointmentOfUser = async(idUser)=>{
    try {
        if(!idUser){
            return{
                err:1,
                message:"ID user required"
            }
        }

        const data = await db.Appointment.findAll({
            where:{id_patient:idUser},

        })
        
    } catch (error) {
        console.log("Lỗi ở getAppointmentOfUser :", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

export { getInfoToMakeAppointment, createAppointment }