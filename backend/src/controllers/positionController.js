import { getPositions } from "../services/positionsService";

const handleGetPositions = async(req,res)=>{
    try {
        const message = await getPositions()
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleGetPositions",error);
        
    }
}

export{handleGetPositions}