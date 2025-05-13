import db from '../models/index'

const getPositions = async()=>{
    try {
        const positions = await db.Position.findAll({
            attributes: ['id', 'name']
        })
        return{
            err:0,
            message:`Get positions success !`,
            data:positions
        }
        
    } catch (error) {
        console.log("Lỗi ở getPositions: ",error);
        return{
            err:-999,
            message:`Error server: ${error}`,
            data:[]
        }
    }
}

export{getPositions}