import { col, fn, Op, where } from 'sequelize';
import db from '../models/index'
import { v4 as uuidv4 } from 'uuid';

// tạo hoặc cập nhập lịch khám bệnh
const createOrUpdateSchedule = async (data) => {
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
        if (data.time_frame.length === 0) {
            return {
                err: 3,
                message: "Time frame is required !"
            }
        }

        const schedule = await db.Schedule.findOne({
            where: {
                [Op.and]: [
                    { [data?.idDoctor ? "id_doctor" : "id_medical_package"]: (data?.idDoctor ? data?.idDoctor : data?.idMedicalPackage) },
                    where(fn('DATE', col('appointment_date')), data?.appointment_date)
                ]
            },
            include: [
                { model: db.Time_frame, as: 'time_frame', through: { attributes: [] } },
            ],
        })

        if (!schedule) {
            let id_schedule = uuidv4()
            await db.Schedule.create({
                id: id_schedule,
                id_doctor: data?.idDoctor,
                id_medical_package: data?.idMedicalPackage,
                appointment_date: data?.appointment_date
            })
            for (const item of data?.time_frame) {
                await db.Schedule_timeFrame.create({
                    id_schedule: id_schedule,
                    id_timeFrame: item
                })
            }

            return {
                err: 0,
                message: "Create schedule success !"
            }
        }
        else {
            for (const item of schedule?.time_frame) {
                await db.Schedule_timeFrame.destroy({
                    where: {
                        id_schedule: schedule.id,
                        id_timeFrame: item?.id
                    }
                })
            }

            for (const item of data?.time_frame) {
                await db.Schedule_timeFrame.create({
                    id_schedule: schedule.id,
                    id_timeFrame: item
                })
            }
            return {
                err: 0,
                message: "Update schedule for doctor success !"
            }
        }

    } catch (error) {
        console.log("Lỗi ở createOrUpdateSchedule: ", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

// lấy thời gian khám bệnh của bác sĩ theo ngày
const getScheduleFollowDate = async (data) => {
    try {
        if (!data.id_doctor && !data.idMedicalPackage) {
            return {
                err: 1,
                message: "ID doctor or medical package is required !"
            }
        }
        if (!data.appointment_date) {
            return {
                err: 1,
                message: "Date is required"
            }
        }

        const schedule = await db.Schedule.findOne({
            where: {
                [Op.and]: [
                    { [data?.id_doctor ? "id_doctor" : "id_medical_package"]: (data?.id_doctor ? data?.id_doctor : data?.idMedicalPackage) },
                    where(fn('DATE', col('appointment_date')), data?.appointment_date)
                ]
            },
            include: [
                { model: db.Time_frame, as: 'time_frame', through: { attributes: [] } },
            ],
        })

        return {
            err: 0,
            message: "Get schedule follow date success !",
            data: schedule
        }

    } catch (error) {
        console.log("Lỗi ở getScheduleFollowDate", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

// lấy các lịch khám của bác sĩ
const getScheduleOfDoctor = async (idDoctor) => {
    try {
        if (!idDoctor) {
            return {
                err: 1,
                message: "Id doctor is required !"
            }
        }

        const data = await db.Schedule.findAll({
            where: { id_doctor: idDoctor },
            attributes: ["appointment_date","id"],
            include: [
                { model: db.Time_frame, as: 'time_frame', through: { attributes: [] } },
            ],
        })

        return {
            err: 0,
            message: "Get schedule of doctor success",
            data: data
        }

    } catch (error) {
        console.log("Lỗi ở getScheduleOfDoctor", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

export { createOrUpdateSchedule, getScheduleFollowDate, getScheduleOfDoctor }