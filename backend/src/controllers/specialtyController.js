const { getSpecialties } = require("../services/specialtyServices");

const handleGetSpecialties = async (req, res) => {
    try {
        let limit = req.query.limit
        const message = await getSpecialties(+limit)
        return res.status(200).json(message)

    } catch (error) {
        console.log("Lỗi ở handleGetSpecialies: ", error);

    }
}

export { handleGetSpecialties }