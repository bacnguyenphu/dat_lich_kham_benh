import db from '../models/index'
import { v4 as uuidv4 } from 'uuid';
import { toSlug } from '../utils/toSlug'
import { where } from 'sequelize';

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

const getCategoryPackageById = async (id) => {
    try {
        if (!id) {
            return {
                err: 1,
                message: 'ID is required !'
            }
        }

        const data = await db.Category_package.findOne({
            where: { id },
            attributes: ['id', 'name', 'image', 'description', 'slug'],
        })

        return {
            err: 0,
            message: 'Get category package by id success !',
            data: data
        }
    } catch (error) {
        console.log("Lỗi ở getCategoryPackageById: ", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

const createCategoryPackage = async (data) => {
    try {
        if (!data.name) {
            return {
                err: 1,
                message: 'Name is required !'
            }
        }
        const id = uuidv4()
        await db.Category_package.create({
            id: id,
            name: data.name,
            image: data?.image,
            description: data?.description,
            slug: toSlug(data.name)
        })

        return {
            err: 0,
            message: 'Create category package success !'
        }
    } catch (error) {
        console.log("Lỗi ở getCategoryPackage: ", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

const updateCategoryPackage = async (data) => {
    try {
        if (!data.id) {
            return {
                err: 1,
                message: "Id is required"
            }
        }
        if (!data.name) {
            return {
                err: 2,
                message: 'Name is required'
            }
        }

        const cate = await db.Category_package.findOne({
            where: { id: data.id },
        })

        if (!cate) {
            return {
                err: 3,
                message: 'Category package is not exist'
            }
        }

        await db.Category_package.update(
            {
                name: data.name,
                image: data?.image,
                description: data?.description,
                slug: toSlug(data.name)
            },
            { where: { id: data.id } }
        )

        return{
            err:0,
            message:'Update category required success !'
        }

    } catch (error) {
        console.log("Lỗi ở updateCategoryPackage: ", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

const deleteCategoryPackage  = async(id)=>{
    try {
        if(!id){
            return {
                err: 1,
                message: "Id is required"
            }
        }

        const cate = await db.Category_package.findOne({
            where: { id},
        })

        if (!cate) {
            return {
                err: 3,
                message: 'Category package is not exist'
            }
        }

        await db.Category_package.destroy({
            where:{id}
        })

        return {
                err: 0,
                message: 'Delete category package success !'
            }

    } catch (error) {
        console.log("Lỗi ở deleteCategoryPackage: ", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

export { getCategoryPackage, createCategoryPackage, getCategoryPackageById, updateCategoryPackage,deleteCategoryPackage }