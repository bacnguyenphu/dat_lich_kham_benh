const { getCategoryPackage } = require("../services/categoryPackageServices");

const handleGetCategoryPackage = async (req, res) => {
    try {
        let limit = req.query.limit
        let page = req.query.page
        const message = await getCategoryPackage(+limit,+page)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleGetCategoryPackage: ", error);

    }
}

export {handleGetCategoryPackage}