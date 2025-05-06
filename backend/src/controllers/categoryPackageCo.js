const { getCategoryPackage } = require("../services/categoryPackage.Services");

const handleGetCategoryPackage = async (req, res) => {
    try {
        let limit = req.query.limit
        const message = await getCategoryPackage(+limit)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleGetCategoryPackage: ", error);

    }
}

export {handleGetCategoryPackage}