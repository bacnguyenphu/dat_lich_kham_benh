import db from '../models/index'
import { v4 as uuidv4 } from 'uuid'

const getPositions = async (limit, page) => {
    try {
        if (!limit || !page) {
            const positions = await db.Position.findAll({
                attributes: ['id', 'name']
            })
            return {
                err: 0,
                message: `Get positions success !`,
                data: positions
            }
        }
        else {
            const { count, rows } = await db.Position.findAndCountAll({
                attributes: ['id', 'name'],
                distinct: true,
                offset: (page - 1) * limit,
                limit: limit,
                order: [['createdAt', 'DESC']]
            });

            return {
                err: 0,
                message: "Get positions success !",
                data: rows,
                page: page,
                totalPage: Math.ceil(count / limit),
                totalData: count
            }
        }

    } catch (error) {
        console.log("Lỗi ở getPositions: ", error);
        return {
            err: -999,
            message: `Error server: ${error}`,
            data: []
        }
    }
}

const createPosition = async (data) => {
    try {
        if (!data?.name) {
            return {
                err: 1,
                message: "Name is required !"
            }
        }

        await db.Position.create({
            name: data?.name
        })

        return {
            err: 0,
            message: "Create position success !"
        }
    } catch (error) {
        console.log("Lỗi ở createPosition: ", error);
        return {
            err: -999,
            message: `Error server: ${error}`,
        }
    }
}

const deletePosition = async (id) => {
    try {
        if (!id) {
            return {
                err: 1,
                message: "ID is required !"
            }
        }
        const position = await db.Position.findOne({
            where: { id: id },
        })

        if (!position) {
            return {
                err: 2,
                message: 'Position is not exist !'
            }
        } else {
            await db.Position.destroy({
                where: { id: id }
            })

            return {
                err: 0,
                message: "Delete position success !"
            }
        }
    } catch (error) {
        console.log("Lỗi ở deletePosition: ", error);
        return {
            err: -999,
            message: `Error server: ${error}`,
        }
    }
}

const updatePosition = async (data) => {
    try {
        if (!data?.name) {
            return {
                err: 1,
                message: "Name is required !"
            }
        }
        if (!data?.id) {
            return {
                err: 2,
                message: "ID is required !"
            }
        }
        const position = await db.Position.findOne({
            where: { id: +data?.id },
        })

        if (!position) {
            return {
                err: 3,
                message: 'Position is not exist !'
            }
        } else {
            await db.Position.update(
                {
                    name: data.name
                },
                {
                    where: { id: +data?.id }
                }
            )

            return {
                err: 0,
                message: "Update position success !"
            }
        }

    } catch (error) {
        console.log("Lỗi ở updatePosition: ", error);
        return {
            err: -999,
            message: `Error server: ${error}`,
        }
    }
}

const getPositionById = async (id) => {
    try {
        if (!id) {
            return {
                err: 1,
                message: "ID is required !"
            }
        }

        const position = await db.Position.findOne({
            attributes: ['id', 'name'],
            where: { id: id },
        })

        if (!position) {
            return {
                err: 2,
                message: `Position is not exist !`,
                data: null
            }
        }

        return {
            err: 0,
            message: `Get position by id success !`,
            data: position
        }

    } catch (error) {
        console.log("Lỗi ở getPositionById: ", error);
        return {
            err: -999,
            message: `Error server: ${error}`,
            data: null
        }
    }
}

export { getPositions, createPosition, deletePosition, updatePosition, getPositionById }