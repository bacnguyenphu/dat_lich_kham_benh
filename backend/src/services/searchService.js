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

            dataDoctor.name = "doctor"
            dataDoctor.data = await db.Doctor.findAll({
                attributes: ['id', 'price', 'updatedAt',],
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['firstName', 'lastName', 'phone', 'email', 'dateOfBirth', 'gender', 'address', 'avatar'],
                        where: whereDoctor,
                    },
                    { model: db.Position, as: 'position', attributes: ['name'], through: { attributes: [] } },
                    { model: db.Specialty, as: 'specialty', attributes: ['name'], through: { attributes: [] } }
                ],
                limit: 5,
            })

            dataSpecialty.name = "specialties"
            dataSpecialty.data = await db.Specialty.findAll({
                where: whereSpecialtyAndPackage,
                limit: 5
            })

            dataPackage.name = "package"
            dataPackage.data = await db.Medical_package.findAll({
                where: whereSpecialtyAndPackage,
                attributes: ['id', 'price', 'name', 'image'],
                include: [
                    { model: db.Category_package, as: 'category_package', attributes: ['id', 'name', 'image', 'description'] },
                ]
            })

            if (dataDoctor.data) {
                data.push(dataDoctor)
            }
            if (dataSpecialty.data) {
                data.push(dataSpecialty)
            }
            if (dataPackage.data) {
                data.push(dataPackage)
            }

        }
        else if (filter === 'doctor') {
            if (value) {
                whereDoctor = {
                    [Op.or]: [{ firstName: { [Op.like]: `%${value}%` } }, { lastName: { [Op.like]: `%${value}%` } }]
                }
            }
            dataDoctor.name = "doctor"
            dataDoctor.data = await db.Doctor.findAll({
                attributes: ['id', 'price', 'updatedAt',],
                include: [
                    {
                        model: db.User,
                        as: 'user',
                        attributes: ['firstName', 'lastName', 'phone', 'email', 'dateOfBirth', 'gender', 'address', 'avatar'],
                        where: whereDoctor
                    },
                    { model: db.Position, as: 'position', attributes: ['name'], through: { attributes: [] } },
                    { model: db.Specialty, as: 'specialty', attributes: ['name'], through: { attributes: [] } }
                ],
                limit: 15,
            })
            data.push(dataDoctor)
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