import db from '../models/index'
import { v4 as uuidv4 } from 'uuid';

const getMedicalPackages = async (limit, page) => {
    try {
        if (!limit || !page) {
            const data = await db.Medical_package.findAll({
                attributes: ['id', 'description', 'price', 'name','image'],
                include: [
                    { model: db.Category_package, as: 'category_package', attributes: ['id', 'name', 'image', 'description'] },
                ]
            })
            return {
                err: 0,
                message: "Get all specialties success !",
                data: data
            }
        }
    } catch (error) {
        console.log("Lỗi ở getMedicalPackage !");
        return {
            err: -999,
            message: `Error server : ${error}`
        }
    }
}

const createMedicalPackage = async (data) => {
    try {
        if (!data.name) {
            return {
                err: 1,
                message: 'Name is required'
            }
        }
        if (!data.id_category_package) {
            return {
                err: 2,
                message: 'id_category_package is required'
            }
        }
        if (!data.price) {
            return {
                err: 3,
                message: 'price is required'
            }
        }

        const id_medical_package = uuidv4()
        const id_description_detail = uuidv4()

        await db.Medical_package.create({
            id: id_medical_package,
            name: data.name,
            id_description_detail: id_description_detail,
            price: data.price,
            image: data?.image,
            description: data?.description,
            id_category_package: data?.id_category_package
        })

        await db.Description_detail.create({
            id: id_description_detail,
            description: data.description_detail
        })

        return {
            err: 0,
            message: "Create medical package success !",
        }

    } catch (error) {
        console.log("Lỗi ở createMedicalPackage !");
        return {
            err: -999,
            message: `Error server : ${error}`
        }
    }
}

export { createMedicalPackage }