const { insertSpecialty,insertCategoryPackage } = require("../services/insert");

const handleInsertSpecialty = async (req, res) => {
    try {
        const message = await insertSpecialty()
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleInsertSpecialty: ", error);

    }
}

const handleInsertCategoryPackage = async(req,res)=>{
    try {
        const message = await insertCategoryPackage()
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleInsertCategoryPackage: ", error);
    }
}

export { handleInsertSpecialty,handleInsertCategoryPackage }