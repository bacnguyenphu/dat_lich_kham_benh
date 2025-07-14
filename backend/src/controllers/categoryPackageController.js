const { getCategoryPackage, createCategoryPackage, getCategoryPackageById } = require("../services/categoryPackageServices");

const handleGetCategoryPackage = async (req, res) => {
    try {
        let limit = req.query.limit
        let page = req.query.page
        const message = await getCategoryPackage(+limit, +page)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleGetCategoryPackage: ", error);
    }
}

const handleGetCategoryPackageById = async (req, res) => {
    try {
        const id = req.query.id
        const message = await getCategoryPackageById(id)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleGetCategoryPackageById: ", error);
    }
}

const handleCreateCreatePackage = async (req, res) => {
    try {
        const data = req.body
        const message = await createCategoryPackage(data)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleCreateCreatePackage: ", error);
    }
}

export { handleGetCategoryPackage, handleCreateCreatePackage,handleGetCategoryPackageById }