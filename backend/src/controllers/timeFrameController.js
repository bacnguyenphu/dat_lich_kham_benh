const { getTimeFrames } = require("../services/timeFrameService");

const handelGetTimeFrames = async(req,res)=>{
    try {
        const message = await getTimeFrames()
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handldeGetTimeFrames: ",error);
        
    }
}

export{handelGetTimeFrames}