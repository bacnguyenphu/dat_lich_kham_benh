const { createDoctor, getDoctors } = require("../services/doctorService");

const handleCreateDoctor = async (req, res) => {
    try {
        const data = req.body
        const message = await createDoctor(data)
        return res.status(200).json(message)

    } catch (error) {
        console.log("Lỗi ở handleCreateDoctor: ", error);

    }
}

const handleGetDoctors = async(req,res)=>{
    try {
        const message = await getDoctors()
        return res.status(200).json(message)
        
    } catch (error) {
        console.log("Lỗi ở handleGetDoctors: ",error);
        
    }
}

export { handleCreateDoctor,handleGetDoctors }