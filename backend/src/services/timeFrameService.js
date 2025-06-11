import db from '../models/index'

const getTimeFrames = async () => {
    try {
        const data = await db.Time_frame.findAll({
             attributes: ['id', 'time_frame']
        })
        return{
            err:0,
            message:"Get time frame success!",
            data
        }
    } catch (error) {
        console.log("Lỗi ở get Timeframes");
        return{
            err:-999,
            message:`Error server : ${error}`,
            data:[]
        }
    }
}

export { getTimeFrames }