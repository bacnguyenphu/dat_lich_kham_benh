import { createAppointment, updateStatusAppointment, getAppointmentOfUser, getInfoToMakeAppointment } from "../services/appointmentService";

const handleGetInfoToMakeAppointment = async (req, res) => {
    try {
        const idDoctor = req.query.idDoctor
        const idMedicalPackage = req.query.idMedicalPackage
        const time_frame = req.query.time_frame
        const appointment_date = req.query.appointment_date
        const message = await getInfoToMakeAppointment({ idDoctor, idMedicalPackage, time_frame, appointment_date })
        return res.status(200).json(message)
    } catch (error) {
        console.log(`Lỗi ở handleGetInfoToMakeAppointment: `, error);
    }
}

const handleCreateAppointment = async (req, res) => {
    try {
        const data = req.body
        const message = await createAppointment(data)
        return res.status(200).json(message)
    } catch (error) {
        console.log(`Lỗi ở handleCreateAppointment: `, error);
    }
}

const handleGetAppointmentOfUser = async(req,res)=>{
    try {
        const idUser = req.query.idUser
        const message = await getAppointmentOfUser(idUser);
        return res.status(200).json(message)
    } catch (error) {
        console.log(`Lỗi ở handleGetAppointmentOfUser: `, error);
    }
}

const handleUpdateStatusAppointment= async(req,res)=>{
    try {
        const idAppointment = req.query.idAppointment
        const status = req.query.status
        console.log(status);
        
        const message = await updateStatusAppointment(idAppointment,+status)
        return res.status(200).json(message)
    } catch (error) {
        console.log(`Lỗi ở handleDeleteAppointment: `, error);
    }
}

export { handleGetInfoToMakeAppointment, handleCreateAppointment,handleGetAppointmentOfUser, handleUpdateStatusAppointment}