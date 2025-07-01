import db from '../models/index'
import { v4 as uuidv4 } from 'uuid'
import { toSlug } from '../utils/toSlug'

const getSpecialties = async (limit, page) => {

    try {
        let specialties = []
        if (!limit || !page) {
            specialties = await db.Specialty.findAll()
            return {
                err: 0,
                message: "Get all specialties success !",
                data: specialties
            }
        }
        else {
            const { count, rows } = await db.Specialty.findAndCountAll({
                attributes: ['id', 'name', 'images', 'slug',],
                distinct: true,
                include: [
                    { model: db.Description_detail, as: 'description_detail', attributes: ['description'] },
                ],
                offset: (page - 1) * limit,
                limit: limit,
                order: [['createdAt', 'DESC']]
            });

            return {
                err: 0,
                message: "Get specialties success !",
                data: rows,
                page: page,
                totalPage: Math.ceil(count / limit),
                totalData: count
            }
        }

    } catch (error) {
        console.log("Lỗi ở getSpecialties: ", error);
        return {
            err: -999,
            message: `Error server : ${error}`
        }
    }
}

const createSchedule = async (data) => {
    try {
        if (!data.name) {
            return {
                err: 1,
                message: "Name is required !"
            }
        }
        const id_specialty = uuidv4()
        const id_description_detail = uuidv4()

        await db.Specialty.create({
            id: id_specialty,
            name: data.name,
            images: data.linkImg,
            slug: toSlug(data.name),
            id_description_detail: id_description_detail
        })

        await db.Description_detail.create({
            id: id_description_detail,
            description: data.description_detail
        })

        return{
            err:0,
            message:"Create Specialty success !"
        }

    } catch (error) {
        console.log("Lỗi ở createSchedule !");
        return {
            err: -999,
            messageL: `Error server: ${error}`
        }
    }
}

const deleteSpecialty = async(id)=>{
    
}

export { getSpecialties,createSchedule }