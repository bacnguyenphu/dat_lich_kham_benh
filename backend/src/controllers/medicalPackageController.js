import { createMedicalPackage } from "../services/medicalPackageService";

const handleCreateMedicalPackage = async (req, res) => {
    try {
        let data = req.body
        const message = await createMedicalPackage(data)
        return res.status(200).json(message)
    } catch (error) {
        console.log('Lỗi ở handleCreateMedicalPackage: ', error);

    }
}

export { handleCreateMedicalPackage }