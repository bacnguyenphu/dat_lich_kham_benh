import db from '../models/index'
const getCategoryPackage = async (limit, page) => {
    try {
        let data = []
        if (!limit || !page) {
            data = await db.Category_package.findAll();

            return {
                err: 0,
                message: "Get category package success!",
                data: data
            }
        }
        else {
            const { count, rows } = await db.Category_package.findAndCountAll({
                attributes: ['id', 'name', 'image', 'description', 'slug'],
                offset: (page - 1) * limit,
                limit: limit,
                order: [['createdAt', 'DESC']]
            });

            return {
                err: 0,
                message: "Get category package limit success!",
                data: rows,
                page: page,
                totalPage: Math.ceil(count / limit),
                totalData: count
            }
        }
    } catch (error) {
        console.log("Lỗi ở getCategoryPackage: ", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }

    }
}

export { getCategoryPackage }