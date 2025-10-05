import { Op } from "sequelize"
import db from '../models/index'

const search = async (value, filter) => {
    try {
        if (!filter) {
            return {
                err: 1,
                message: "Filter is required"
            }
        }
        let data = []
        let whereDoctor = {}
        let whereSpecialtyAndPackage = {}
        let dataDoctor = {}
        let dataSpecialty = {}
        let dataPackage = {}
        if (filter === 'all') {
            if (value) {
                whereDoctor = { [Op.or]: [{ firstName: value }, { lastName: value }] }
                whereSpecialtyAndPackage.name = { [Op.like]: `%${value}%` };
            }
            else {
                whereDoctor = {}
                whereSpecialtyAndPackage = {};
            }

            dataDoctor.name = "doctor"
            dataDoctor.data = await db.Doctor.findAll({
                attributes: ['id'],
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['firstName', 'lastName', 'avatar'],
                        where: whereDoctor,
                    },
                    { model: db.Position, as: 'position', attributes: ['name'], through: { attributes: [] } },
                    { model: db.Specialty, as: 'specialty', attributes: ['name'], through: { attributes: [] } }
                ],
                limit: 5,
            })

            dataSpecialty.name = "specialty"
            dataSpecialty.data = await db.Specialty.findAll({
                where: whereSpecialtyAndPackage,
                attributes: ['id', 'name', 'images',],
                limit: 5
            })

            dataPackage.name = "package"
            dataPackage.data = await db.Medical_package.findAll({
                where: whereSpecialtyAndPackage,
                attributes: ['id', 'name', 'image'],
                include: [
                    { model: db.Category_package, as: 'category_package', attributes: ['id', 'name'] },
                ]
            })

            if (dataDoctor.data.length > 0) {
                data.push(dataDoctor)
            }
            if (dataSpecialty.data.length > 0) {
                data.push(dataSpecialty)
            }
            if (dataPackage.data.length > 0) {
                data.push(dataPackage)
            }

        }
        else if (filter === 'doctor') {
            if (value) {
                whereDoctor = { [Op.or]: [{ firstName: value }, { lastName: value }] }
            }
            else {
                whereDoctor = {}
            }
            dataDoctor.name = "doctor"
            dataDoctor.data = await db.Doctor.findAll({
                attributes: ['id'],
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['firstName', 'lastName', 'avatar'],
                        where: whereDoctor
                    },
                    { model: db.Position, as: 'position', attributes: ['name'], through: { attributes: [] } },
                    { model: db.Specialty, as: 'specialty', attributes: ['name'], through: { attributes: [] } }
                ],
                limit: 15,
            })
            if (dataDoctor.data.length > 0) {
                data.push(dataDoctor)
            }
        }
        else if (filter === 'specialty') {
            if (value) {
                whereSpecialtyAndPackage.name = { [Op.like]: `%${value}%` };
            }
            else {
                whereSpecialtyAndPackage= {};
            }
            dataSpecialty.name = "specialty"
            dataSpecialty.data = await db.Specialty.findAll({
                where: whereSpecialtyAndPackage,
                attributes: ['id', 'name', 'images',],
                limit: 15
            })

            dataPackage.name = "package"
            dataPackage.data = await db.Medical_package.findAll({
                where: whereSpecialtyAndPackage,
                attributes: ['id', 'price', 'name', 'image'],
                include: [
                    { model: db.Category_package, as: 'category_package', attributes: ['id', 'name', 'image', 'description'] },
                ]
            })
            if (dataSpecialty.data.length > 0) {
                data.push(dataSpecialty)
            }
        }
        else if (filter === 'package') {
            if (value) {
                whereSpecialtyAndPackage.name = { [Op.like]: `%${value}%` };
            }
            else {
                whereSpecialtyAndPackage.name = {};
            }
            dataPackage.name = "package"
            dataPackage.data = await db.Medical_package.findAll({
                where: whereSpecialtyAndPackage,
                attributes: ['id', 'name', 'image'],
                include: [
                    { model: db.Category_package, as: 'category_package', attributes: ['id', 'name'] },
                ],
                limit:15
            })
            if (dataPackage.data.length > 0) {
                data.push(dataPackage)
            }
        }

        return {
            err: 0,
            message: "Search success !",
            data
        }

    } catch (error) {
        console.log("Lỗi ở search: ", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

export { search }