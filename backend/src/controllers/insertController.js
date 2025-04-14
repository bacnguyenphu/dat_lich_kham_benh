const { insertSpecialty } = require("../services/insert");

const handleInsertSpecialty = async (req, res) => {
    try {
        const message = await insertSpecialty()
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleInsertSpecialty: ", error);

    }
}

export { handleInsertSpecialty }