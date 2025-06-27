import { col, fn, Op, where } from 'sequelize';
import db from '../models/index'
import { v4 as uuidv4 } from 'uuid';

// tạo hoặc cập nhập lịch khám bệnh
const createOrUpdateSchedule = async (data) => {
    try {
        if (!data.idDoctor) {
            return {
                err: 1,
                message: "ID doctor is required !"
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
                    { id_doctor: data?.idDoctor },
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
                message: "Create schedule for doctor success !"
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
        if (!data.id_doctor) {
            return {
                err: 1,
                message: "ID doctor is required"
            }
        }
        if (!data.appointment_date) {
            return {
                err: 1,
                message: "ID doctor is required"
            }
        }

        const schedule = await db.Schedule.findOne({
            where: {
                [Op.and]: [
                    { id_doctor: data?.id_doctor },
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

export { createOrUpdateSchedule, getScheduleFollowDate }