import { getPatientOfDoctor } from "../services/appointmentService";

const { createDoctor, getDoctors, getDoctorById, deleteDoctorById, updateDoctor, getDoctorFollowSpecialty } = require("../services/doctorService");

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

const handleDeleteDoctorById = async (req, res) => {
    try {
        const idDoctor = req.query.idDoctor
        const message = await deleteDoctorById(idDoctor)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleDeleteDoctorById: >>>>>>", error);
    }
}

const handleUpdateDoctor =async(req,res)=>{
    try {
        const data = req.body
        const message = await updateDoctor(data)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleUpdateDoctor: >>>>>>", error);
    }
}

const handleGetDoctorFollowSpecialty = async(req,res)=>{
    try {
        let id = req.query.id
        const limit = req.query.limit
        const page = req.query.page
        const message = await getDoctorFollowSpecialty(id,+limit,+page)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleGetDoctorFollowSpecialty: ",error);
        
    }
}

const handleGetPatientOfDoctor = async(req,res)=>{
    try {
        const idDoctor = req.query.idDoctor
        const limit = req.query.limit
        const page = req.query.page

        const message = await getPatientOfDoctor(idDoctor,+limit,+page)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleGetPatientOfDoctor: ",error);
    }
}

export { handleCreateDoctor, handleGetDoctors, handleGetDoctorById, 
    handleDeleteDoctorById, handleUpdateDoctor,handleGetDoctorFollowSpecialty, 
    handleGetPatientOfDoctor
}