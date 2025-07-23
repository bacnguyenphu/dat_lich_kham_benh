import db from '../models/index'
import { v4 as uuidv4 } from 'uuid';

const getMedicalPackages = async (limit, page) => {
    try {
        if (!limit || !page) {
            const data = await db.Medical_package.findAll({
                attributes: ['id', 'description', 'price', 'name', 'image'],
                include: [
                    { model: db.Category_package, as: 'category_package', attributes: ['id', 'name', 'image', 'description'] },
                ]
            })
            return {
                err: 0,
                message: "Get all medical packages success !",
                data: data
            }
        }
        else {
            const { count, rows } = await db.Medical_package.findAndCountAll({
                attributes: ['id', 'description', 'price', 'name', 'image'],
                distinct: true,
                include: [
                    { model: db.Category_package, as: 'category_package', attributes: ['id', 'name', 'image', 'description'] },
                ],
                offset: (page - 1) * limit,
                limit: limit,
                order: [['createdAt', 'DESC']]
            });

            return {
                err: 0,
                message: "Get medical packages success !",
                data: rows,
                page: page,
                totalPage: Math.ceil(count / limit),
                totalData: count
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

const getMedicalPackageById = async (id) => {
    try {
        if (!id) {
            return {
                err: 1,
                message: `ID is required !`
            }
        }

        const data = await db.Medical_package.findOne({
            include: [
                { model: db.Category_package, as: 'category_package', attributes: ['id', 'name', 'image', 'description','slug'] },
                { model: db.Description_detail, as: 'description_detail', attributes: ['description', 'id'] },
            ],
            where: { id }
        })

        return {
            err: 0,
            message: "Get medical package by id success !",
            data
        }

    } catch (error) {
        console.log("Lỗi ở getMedicalPackageById !");
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

const updateMedicalPackage = async (data) => {
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
                message: 'Price is required'
            }
        }
        if (!data.idMedicalPackage) {
            return {
                err: 4,
                message: 'ID is required'
            }
        }

        const medical_package = await db.Medical_package.findOne({
            include: [
                { model: db.Description_detail, as: 'description_detail', attributes: ['description', 'id'] },
            ],
            where: { id: data.idMedicalPackage }
        })

        if (!medical_package) {
            return {
                err: 5,
                message: 'Mecial package is not exist !'
            }
        }

        await db.Medical_package.update(
            {
                name: data.name,
                price: data.price,
                image: data?.image,
                description: data?.description,
                id_category_package: data?.id_category_package
            },
            {
                where: { id: data.idMedicalPackage }
            }
        )

        await db.Description_detail.update(
            {
                description: data.description_detail
            },
            {
                where: { id: medical_package.description_detail.id }
            }
        )

        return {
            err: 0,
            message: "Update medical package success !",
        }

    } catch (error) {
        console.log("Lỗi ở updateMedicalPackage !");
        return {
            err: -999,
            message: `Error server : ${error}`
        }
    }
}

const deleteMedicalPackage = async (id) => {
    try {
        if (!id) {
            return {
                err: 1,
                message: "Id is required !"
            }
        }

        const medical_package = await db.Medical_package.findOne({
            include: [
                { model: db.Description_detail, as: 'description_detail', attributes: ['description', 'id'] },
            ],
            where: { id: id }
        })

        if (!medical_package) {
            return {
                err: 2,
                message: 'Mecial package is not exist !'
            }
        }

        await db.Medical_package.destroy(
            {
                where: { id: id }
            }
        )

        await db.Description_detail.destroy(
            {
                where: { id: medical_package.description_detail.id }
            }
        )

        return {
            err: 0,
            message: 'Delete medical package success !'
        }

    } catch (error) {
        console.log("Lỗi ở deleteMedicalPackage !");
        return {
            err: -999,
            message: `Error server : ${error}`
        }
    }
}

const getMedicalPackageFollowCategory = async (idCategory, limit, page) => {
    try {
        if (!idCategory) {
            return {
                err: 1,
                message: 'ID category is required !'
            }
        }
        const { count, rows } = await db.Medical_package.findAndCountAll({
            attributes: ['id', 'description', 'price', 'name', 'image'],
            distinct: true,
            include: [
                { 
                    model: db.Category_package, 
                    as: 'category_package', 
                    attributes: ['name'],
                    where: { id: idCategory }, 
                },
            ],
            offset: (page - 1) * limit,
            limit: limit,
            order: [['createdAt', 'DESC']]
        });

        return{
            err: 0,
            message: "Get medical package follow category success !",
            data: rows,
            page: +page,
            totalPage: Math.ceil(count / limit),
            totalData: count
        }

    } catch (error) {
        console.log("Lỗi ở getMedicalPackageFollowCategory !");
        return {
            err: -999,
            message: `Error server : ${error}`
        }
    }
}

export { createMedicalPackage, getMedicalPackages, getMedicalPackageById, updateMedicalPackage, deleteMedicalPackage, getMedicalPackageFollowCategory }