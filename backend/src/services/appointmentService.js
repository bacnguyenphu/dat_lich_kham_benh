import { col, fn, Op, Sequelize, where } from 'sequelize';
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
        const timeFrame = await db.Time_frame.findOne({
            where: { id: data?.time_frame }
        })

        if (data?.idDoctor) {
            const doctor = await db.Doctor.findOne({
                where: { id: data?.idDoctor },
                attributes: ['id', 'description', 'price',],
                include: [
                    { model: db.User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'avatar'] },
                    { model: db.Position, as: 'position', attributes: ['name', 'id'], through: { attributes: [] } },
                ]
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
        }

        if (data?.idMedicalPackage) {
            const Medical_package = await db.Medical_package.findOne({
                where: { id: data.idMedicalPackage },
                attributes: ['id', 'image', 'price', 'name'],
            })

            return {
                err: 0,
                message: "Get success !",
                data: {
                    Medical_package,
                    time_frame: timeFrame.time_frame,
                    appointment_date: data?.appointment_date
                }
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

const getAppointmentOfUser = async (idUser, limit, page) => {
    try {
        if (!idUser) {
            return {
                err: 1,
                message: "ID user required"
            }
        }

        const { count, rows } = await db.Appointment.findAndCountAll({
            where: { id_patient: idUser },
            attributes: ['id', 'appointment_date', 'time', 'status', 'payment_status'],
            include: [
                {
                    model: db.Doctor, as: 'doctor', attributes: ['price'],
                    include: [
                        { model: db.Position, as: 'position', attributes: ['name', 'id'], through: { attributes: [] } },
                        { model: db.User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'avatar'] },
                    ]
                },
                {
                    model: db.Medical_package, as: 'medical_package', attributes: ['id', 'image', 'price', 'name'],
                },
            ],
            order: [['createdAt', 'DESC']],
            offset: (page - 1) * limit,
            limit: limit,
            subQuery: false,
        })

        if (rows.length === 0) {
            return {
                err: 0,
                message: "Get appointment of user success !",
                data: [],
                page: 1,
                totalPage: 0,
            }
        }

        return {
            err: 0,
            message: "Get appointment of user success !",
            data: rows,
            page: page,
            totalPage: Math.ceil(count / limit),
            totalData: count
        }

    } catch (error) {
        console.log("Lỗi ở getAppointmentOfUser :", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

const updateStatusAppointment = async (idAppointment, status) => {
    try {
        if (!idAppointment) {
            return {
                err: 1,
                message: "ID appointment required"
            }
        }

        const appointment = await db.Appointment.findOne({
            where: { id: idAppointment }
        })

        if (!appointment) {
            return {
                err: 2,
                message: "Appointment is not exist"
            }
        }

        await db.Appointment.update(
            {
                status: status
            },
            {
                where: { id: idAppointment },
            }
        )

        return {
            err: 0,
            message: "Update status appointment success !"
        }

    } catch (error) {
        console.log("Lỗi ở deleteAppointment :", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

const getAppointmentOfDoctor = async (idDoctor, limit, page, value, filter) => {
    try {
        if (!idDoctor) {
            return {
                err: 1,
                message: "ID doctor required"
            }
        }
        if (!filter) {
            return {
                err: 1,
                message: "Filter is required"
            }
        }
        let wherePhoneOrName = {}
        let whereAppointment = {
            id_doctor: idDoctor
        }
        if (+filter !== 99) {
            whereAppointment.status = +filter
        }
        if (value) {
            wherePhoneOrName = { [Op.or]: [{ firstName: value }, { lastName: value }, { phone: value }] }
        }

        const { count, rows } = await db.Appointment.findAndCountAll({
            where: whereAppointment,
            attributes: ['id', 'appointment_date', 'time', 'status', 'payment_status'],
            include: [
                {
                    model: db.User, 
                    as: 'user', 
                    attributes: ['id', 'firstName', 'lastName', 'phone'],
                    where:wherePhoneOrName
                },
            ],
            order: [['createdAt', 'DESC']],
            offset: (page - 1) * limit,
            limit: limit,
            subQuery: false,
            distinct: true,
        })

        if (rows.length === 0) {
            return {
                err: 0,
                message: "No appointments found for this doctor.",
                data: [],
                page: 1,
                totalPage: 0,
            }
        }

        return {
            err: 0,
            message: "Get appointment of doctor success !",
            data: rows,
            page: page,
            totalPage: Math.ceil(count / limit),
            totalData: count
        }

    } catch (error) {
        console.log("Lỗi ở getAppointmentOfDoctor :", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

const getPatientOfDoctor = async(idDoctor,limit=7,page=1)=>{
    try {
        if (!idDoctor) {
            return {
                err: 1,
                message: "ID doctor required"
            }
        }

        const { count, rows } = await db.Appointment.findAndCountAll({
            where:{
                [Op.and]: [{ id_doctor: idDoctor }, { status:3 }]
            },
            attributes:[
                'id_patient',
                [Sequelize.fn('COUNT',Sequelize.col('Appointment.id')),'visitCount']
            ],
            include:[
                {
                    model:db.User,
                    as:'user',
                    attributes:['firstName','lastName','address','phone']
                }
            ],
            group:['id_patient'],
            order: [['createdAt', 'DESC']],
            offset: (page - 1) * limit,
            limit: limit,
            subQuery: false,
            
        })

        if (rows.length === 0) {
            return {
                err: 0,
                message: "No patients found for this doctor.",
                data: [],
                page: 1,
                totalPage: 0,
            }
        }

        return {
            err: 0,
            message: "Get patients of doctor success !",
            data: rows,
            page: page,
            totalPage: Math.ceil(count.length / limit),
            totalData: count.length
        }

    } catch (error) {
        console.log("Lỗi ở getPatientOfDoctor :", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

export {
    getInfoToMakeAppointment, createAppointment, getAppointmentOfUser,
    updateStatusAppointment, getAppointmentOfDoctor,getPatientOfDoctor
}