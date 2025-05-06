import db from '../models/index'
const getCategoryPackage = async(limit)=>{
    try {
        let data = []
        if(!limit){
            data = await db.Category_package.findAll();

            return{
                err:0,
                message:"Get category package success!",
                data: data
            }
        }
        else{
            data = await db.Category_package.findAll({
                offset: 0,
                limit
            });

            return{
                err:0,
                message:"Get category package limit success!",
                data: data
            }
        }
    } catch (error) {
        console.log("Lỗi ở getCategoryPackage: ",error);
        return{
            err:-999,
            message:`Error server: ${error}`
        }
        
    }
}

export {getCategoryPackage}