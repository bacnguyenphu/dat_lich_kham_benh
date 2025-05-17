const { createDoctor } = require("../services/doctorService");

const handleCreateDoctor = async (req, res) => {
    try {
        const data = req.body
        const message = await createDoctor(data)
        return res.status(200).json(message)

    } catch (error) {
        console.log("Lỗi ở handleCreateDoctor: ", error);

    }
}

export { handleCreateDoctor }