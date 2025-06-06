const { createDoctor, getDoctors, getDoctorById } = require("../services/doctorService");

const handleCreateDoctor = async (req, res) => {
    try {
        const data = req.body
        const message = await createDoctor(data)
        return res.status(200).json(message)

    } catch (error) {
        console.log("Lỗi ở handleCreateDoctor: ", error);

    }
}

const handleGetDoctors = async (req, res) => {
    try {
        const limit = req.query.limit
        const page = req.query.page
        const message = await getDoctors(+limit, +page)
        return res.status(200).json(message)

    } catch (error) {
        console.log("Lỗi ở handleGetDoctors: ", error);

    }
}

const handleGetDoctorById = async (req, res) => {
    try {
        const idDoctor = req.query.idDoctor
        const message = await getDoctorById(idDoctor)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handelGetDoctorById: ", error);
    }
}

export { handleCreateDoctor, handleGetDoctors, handleGetDoctorById }