import db from '../models/index'

const getSpecialties = async (limit, page) => {

    try {
        let specialties = []
        if (!limit||!page) {
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

export { getSpecialties }