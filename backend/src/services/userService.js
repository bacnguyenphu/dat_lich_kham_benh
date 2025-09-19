import { where } from 'sequelize'
import db from '../models/index'

const getUsers = async (limit, page) => {
    try {
        const { count, rows } = await db.User.findAndCountAll({
            where: { role: "R3" },
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
            offset: (page - 1) * limit,
            limit: limit,
        })

        if (rows.length === 0) {
            return {
                err: 0,
                message: "Get doctors success!",
                data: [],
                page: 1,
                totalPage: 0,
            }
        }

        return {
            err: 0,
            message: "Get users success!",
            data: rows,
            page: page,
            totalPage: Math.ceil(count / limit),
            totalData: count
        }

    } catch (error) {
        console.log("Lỗi ở getUsers");
        return {
            err: -999,
            message: `Error server : ${error}`,
            data: []
        }
    }
}

const getUserById = async (id) => {
    try {

        if (!id) {
            return {
                err: 2,
                message: "ID is required",
                data: user
            }
        }

        const user = await db.User.findOne({
            where: { id: id },
            attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        })

        if (!user) {
            return {
                err: 2,
                message: "User is not exist",
                data: null
            }
        }

        return {
            err: 0,
            message: "Get user by id success !",
            data: user
        }

    } catch (error) {
        console.log("Lỗi ở getUserById");
        return {
            err: -999,
            message: `Error server : ${error}`,
            data: []
        }
    }
}

const updateUser = async (data) => {
    try {
        if (!data.idUser) {
            return {
                err: 1,
                message: 'ID user is required'
            }
        }
        const user = await db.User.findOne({
            where: { id: data?.idUser },
            attributes: ['id'],
           
        })

        if (!user) {
            return {
                err: 2,
                message: `User is not exist`
            }
        }

        await db.User.update(
            {
                firstName: data?.firstName.trim(),
                lastName: data?.lastName.trim(),
                role: data?.role,
                phone: data?.phone.trim(),
                email: data?.email.trim(),
                dateOfBirth: data?.dateOfBirth,
                gender: data?.gender,
                address: data?.address.trim(),
                avatar: data?.avatar
            },
            {
                where: { id: data.idUser }
            }
        )

        return {
            err: 0,
            message: "Update user success!"
        }

    } catch (error) {
        console.log("Lỗi ở updateUser: ", error);
        return {
            err: -999,
            message: `Server error: ${error}`
        }
    }
}

const deleteUserById = async (idUser) => {
    try {
        if (!idUser) {
            return {
                err: 1,
                message: 'ID user is required'
            }
        }

        const user = await db.User.findOne({
            where: { id: idUser },
            attributes: ['id'],
           
        })

        if (!user) {
            return {
                err: 2,
                message: `User is not exist`
            }
        }

        await db.User.destroy({
            where: {
                id: idUser,
            },
        });

        return {
            err: 0,
            message: 'Delete user success'
        }

    } catch (error) {
        console.log("Lỗi ở deleteUserById: ", error);
        return {
            err: -999,
            message: `Server error: ${error}`
        }
    }
}

export { getUsers, getUserById, updateUser, deleteUserById }