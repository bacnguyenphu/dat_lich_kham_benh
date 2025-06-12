import db from '../models/index'
import { v4 as uuidv4 } from 'uuid';

const createOrUpdateSchedule = async(data)=>{
    try {
        if(!data.idDoctor){
            return{
                err:1,
                message:"ID doctor is required !"
            }
        }
        if(!data.appointment_date){
            return{
                err:2,
                message:"Appoinment is required !"
            }
        }
        if(data.time_frame.length===0){
            return{
                err:3,
                message:"Time frame is required !"
            }
        }

        let id_schedule = uuidv4()
        await db.Schedule.create({
            id: id_schedule,
            id_doctor:data?.idDoctor,
            appointment_date: data?.appointment_date
        })

        for(const item of data?.time_frame){
            await db.Schedule_timeFrame.create({
                id_schedule:id_schedule,
                id_timeFrame: item
            })
        }

        return{
            err:0,
            message:"Create schedule for doctor success !"
        }

    } catch (error) {
        console.log("Lỗi ở createOrUpdateSchedule: ",error);
        return{
            err:-999,
            message:`Error server: ${error}`
        }
    }
}

export{createOrUpdateSchedule}