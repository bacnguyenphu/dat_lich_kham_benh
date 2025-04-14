import db from '../models/index'

const getSpecialties = async(limit)=>{
    try {
        let specialties =[]
        if(limit){
            specialties = await db.Specialty.findAll()
            return{
                err:0,
                message:"Get all specialties success !",
                data: specialties
            }
        }
        
    } catch (error) {
        console.log("Lỗi ở getSpecialties: ", error);
        return{
            err:-999,
            message: `Error server : ${error}`
        }
    }
}

export{getSpecialties}