import { createMedicalPackage, deleteMedicalPackage, getMedicalPackageById, getMedicalPackages, updateMedicalPackage } from "../services/medicalPackageService";

const handleCreateMedicalPackage = async (req, res) => {
    try {
        let data = req.body
        const message = await createMedicalPackage(data)
        return res.status(200).json(message)
    } catch (error) {
        console.log('Lỗi ở handleCreateMedicalPackage: ', error);

    }
}

const handleUpdateMedicalPackage = async (req, res) => {
    try {
        let data = req.body
        const message = await updateMedicalPackage(data)
        return res.status(200).json(message)
    } catch (error) {
        console.log('Lỗi ở handleUpdateMedicalPackage: ', error);

    }
}

const handleGetMedicalPackage = async (req, res) => {
    try {
        let limit = req.query.limit
        let page = req.query.page
        const message = await getMedicalPackages(+limit, +page)
        return res.status(200).json(message)
    } catch (error) {
        console.log('Lỗi ở handleGetMedicalPackage: ', error);
    }
}

const handleGetMedicalPackageById = async (req, res) => {
    try {
        let id = req.query.id
        const message = await getMedicalPackageById(id)
        return res.status(200).json(message)
    } catch (error) {
        console.log('Lỗi ở handleGetMedicalPackageById: ', error);
    }
}

const handleDeleteMedicalPackage = async (req, res) => {
    try {
        let id = req.query.id
        const message = await deleteMedicalPackage(id)
        return res.status(200).json(message)
    } catch (error) {
        console.log('Lỗi ở handleDeleteMedicalPackage: ', error);
    }
}

export { handleCreateMedicalPackage, handleGetMedicalPackage, handleGetMedicalPackageById, handleUpdateMedicalPackage, handleDeleteMedicalPackage }