import db from '../models/index'
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import { Op } from 'sequelize';

const hashPass = (password) => {
    return bcrypt.hashSync(password, 12);
}

const checkPass = (password, passwordConfirm) => {
    return bcrypt.compareSync(password, passwordConfirm);
}

const createDoctor = async (data) => {
    try {

        const id_doctor = uuidv4()
        const id_user = uuidv4()
        const id_description_detail = uuidv4()

        await db.Doctor.create({
            id: id_doctor,
            description: data.description,
            id_description_detail: id_description_detail,
            id_user: id_user,
            price: data.price,
        })

        await db.User.create({
            id: id_user,
            firstName: data.firstName.trim(),
            lastName: data.lastName.trim(),
            role: data.role,
            phone: data.phone.trim(),
            email: data.email.trim(),
            password: hashPass(data.password),
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            address: data.address.trim(),
            avatar: data.avatar
        })

        await db.Description_detail.create({
            id: id_description_detail,
            description: data.description_detail
        })

        if (data.id_position.length > 0) {
            for (const item of data.id_position) {
                await db.Position_doctor.create({
                    id_doctor: id_doctor,
                    id_position: +item
                })
            }
        } else {
            return {
                err: 1,
                message: "Position is require"
            }
        }

        if (data.id_specialty.length > 0) {
            for (const item of data.id_specialty) {
                await db.Specialty_doctor.create({
                    id_doctor: id_doctor,
                    id_specialty: item
                })
            }
        } else {
            return {
                err: 2,
                message: "Specialty is require"
            }
        }

        return {
            err: 0,
            message: "Create doctor success!"
        }

    } catch (error) {
        console.log("Lỗi ở createDoctor: ", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

const getDoctors = async (limit, page) => {
    try {
        if (!limit || !page) {
            const data = await db.Doctor.findAll({
                attributes: ['id', 'description', 'price', 'updatedAt',],
                include: [
                    { model: db.User, as: 'user', attributes: ['firstName', 'lastName', 'phone', 'email', 'dateOfBirth', 'gender', 'address', 'avatar'] },
                    { model: db.Position, as: 'position', attributes: ['name'], through: { attributes: [] } },
                    { model: db.Specialty, as: 'specialty', attributes: ['name'], through: { attributes: [] } }
                ]
            })
            return {
                err: 0,
                message: "Get doctors success!",
                data,
                page: 1,
                totalPage: 0,
            }
        }

        const { count, rows } = await db.Doctor.findAndCountAll({
            attributes: ['id', 'description', 'price', 'updatedAt',],
            distinct: true,
            include: [
                { model: db.User, as: 'user', attributes: ['firstName', 'lastName', 'phone', 'email', 'dateOfBirth', 'gender', 'address', 'avatar'] },
                { model: db.Position, as: 'position', attributes: ['name', 'id'], through: { attributes: [] } },
                { model: db.Specialty, as: 'specialty', attributes: ['name', 'id', 'slug'], through: { attributes: [] } },
            ],
            offset: (page - 1) * limit,
            limit: limit,
        });

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
            message: "Get doctors success!",
            data: rows,
            page: page,
            totalPage: Math.ceil(count / limit),
            totalData: count
        }

    } catch (error) {
        console.log("Lỗi ở getDoctors: ", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

const getDoctorById = async (idDoctor) => {
    try {
        if (!idDoctor) {
            return {
                err: 1,
                message: `ID doctor is require`
            }
        }

        const data = await db.Doctor.findOne({
            where: { id: idDoctor },
            attributes: ['id', 'description', 'price', 'updatedAt',],
            include: [
                { model: db.User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'phone', 'email', 'dateOfBirth', 'gender', 'address', 'avatar'] },
                { model: db.Position, as: 'position', attributes: ['name', 'id'], through: { attributes: [] } },
                { model: db.Specialty, as: 'specialty', attributes: ['name', 'id', 'slug'], through: { attributes: [] } },
                { model: db.Description_detail, as: 'description_detail', attributes: ['description', 'id'] },
            ]
        })

        if (!data) {
            return {
                err: 2,
                message: `Doctor is not exist`
            }
        }

        return {
            err: 0,
            message: "Get doctor success",
            data
        }

    } catch (error) {
        console.log("Lỗi ở getDoctorById: ", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

const deleteDoctorById = async (idDoctor) => {
    try {
        if (!idDoctor) {
            return {
                err: 1,
                message: 'ID doctor is required'
            }
        }

        const doctor = await db.Doctor.findOne({
            where: { id: idDoctor },
            attributes: ['id'],
            include: [
                { model: db.User, as: 'user', attributes: ['id'] },
                { model: db.Position, as: 'position', attributes: ['id'], through: { attributes: [] } },
                { model: db.Specialty, as: 'specialty', attributes: ['id'], through: { attributes: [] } },
                { model: db.Description_detail, as: 'description_detail', attributes: ['id'] },
            ]
        })

        if (!doctor) {
            return {
                err: 2,
                message: `Doctor is not exist`
            }
        }

        await db.Doctor.destroy({
            where: {
                id: idDoctor,
            },
        });
        await db.User.destroy({
            where: {
                id: doctor?.user?.id,
            },
        });
        await db.Description_detail.destroy({
            where: {
                id: doctor?.description_detail?.id,
            },
        });

        for (const item of doctor.position) {
            await db.Position_doctor.destroy({
                where: {
                    id_doctor: idDoctor,
                    id_position: item?.id
                }
            })
        }

        for (const item of doctor.specialty) {
            await db.Specialty_doctor.destroy({
                where: {
                    id_doctor: idDoctor,
                    id_specialty: item?.id
                }
            })
        }

        return {
            err: 0,
            message: 'Delete doctor success'
        }

    } catch (error) {
        console.log("Lỗi ở deleteDoctorById: ", error);
        return {
            err: -999,
            message: `Server error: ${error}`
        }
    }
}

const updateDoctor = async (data) => {
    try {
        if (!data.idDoctor) {
            return {
                err: 1,
                message: 'ID doctor is required'
            }
        }
        const doctor = await db.Doctor.findOne({
            where: { id: data?.idDoctor },
            attributes: ['id'],
            include: [
                { model: db.User, as: 'user', attributes: ['id'] },
                { model: db.Position, as: 'position', attributes: ['id'], through: { attributes: [] } },
                { model: db.Specialty, as: 'specialty', attributes: ['id'], through: { attributes: [] } },
                { model: db.Description_detail, as: 'description_detail', attributes: ['id'] },
            ]
        })

        if (!doctor) {
            return {
                err: 2,
                message: `Doctor is not exist`
            }
        }

        await db.Doctor.update(
            {
                description: data.description,
                price: data.price,
            },
            {
                where: { id: data?.idDoctor }
            }
        )

        await db.User.update(
            {
                firstName: data.firstName.trim(),
                lastName: data.lastName.trim(),
                role: data.role,
                phone: data.phone.trim(),
                email: data.email.trim(),
                dateOfBirth: data.dateOfBirth,
                gender: data.gender,
                address: data.address.trim(),
                avatar: data.avatar
            },
            {
                where: { id: doctor?.user?.id, }
            }
        )

        await db.Description_detail.update(
            {
                description: data.description_detail
            },
            { where: { id: doctor?.description_detail?.id } }
        )

        for (const item of doctor.position) {
            await db.Position_doctor.destroy({
                where: {
                    id_doctor: data.idDoctor,
                    id_position: item?.id
                }
            })
        }

        for (const item of doctor.specialty) {
            await db.Specialty_doctor.destroy({
                where: {
                    id_doctor: data.idDoctor,
                    id_specialty: item?.id
                }
            })
        }

        if (data.id_position.length > 0) {
            for (const item of data.id_position) {
                await db.Position_doctor.create({
                    id_doctor: data?.idDoctor,
                    id_position: +item
                })
            }
        } else {
            return {
                err: 1,
                message: "Position is require"
            }
        }

        if (data.id_specialty.length > 0) {
            for (const item of data.id_specialty) {
                await db.Specialty_doctor.create({
                    id_doctor: data?.idDoctor,
                    id_specialty: item
                })
            }
        } else {
            return {
                err: 2,
                message: "Specialty is require"
            }
        }

        return {
            err: 0,
            message: "Update doctor success!"
        }

    } catch (error) {
        console.log("Lỗi ở updateDoctor: ", error);
        return {
            err: -999,
            message: `Server error: ${error}`
        }
    }
}

const getDoctorFollowSpecialty = async (id, limit, page) => {
    try {
        if (!id) {
            return {
                err: 1,
                message: "ID specialty is required !"
            }
        }

        // const data = await db.Doctor.findAll({
        //     include: [
        //         {
        //             model: db.Specialty,
        //             as: 'specialty',
        //             attributes: ['id'],
        //             through: { attributes: [] },
        //             where: { id: id },
        //             required: true
        //         },
        //         { model: db.User, as: 'user', attributes: ['firstName', 'lastName', 'avatar', 'address'],required: true },
        //         { model: db.Position, as: 'position', attributes: ['name', 'id'], through: { attributes: [] },required: true },
        //     ],
        //     // offset: (page - 1) * limit,
        //     // limit: limit,
        //     distinct: true,
        // })

        const { count, rows } = await db.Doctor.findAndCountAll({
            include: [
                {
                    model: db.Specialty,
                    as: 'specialty',
                    attributes: ['id'],
                    through: { attributes: [] },
                    where: { id: id },
                    required: true
                },
                { model: db.User, as: 'user', attributes: ['firstName', 'lastName', 'avatar', 'address'], required: true },
                { model: db.Position, as: 'position', attributes: ['name', 'id'], through: { attributes: [] }, required: true },
            ],
            offset: (page - 1) * limit,
            limit: limit,
            distinct: true,
        })

        return {
            err: 0,
            message: "Get doctor follow specialty success !",
            data: rows,
            page: +page,
            totalPage: Math.ceil(count / limit),
            totalData: count
        }

    } catch (error) {
        console.log("Lỗi ở getDoctorFollowSpecialty", error);
        return {
            err: -999,
            message: `Server error: ${error}`
        }
    }
}

const getAppointmentOfUserFollowDoctor = async (idUser, idDoctor) => {
    try {
        if (!idDoctor) {
            return {
                err: 1,
                message: 'ID doctor is required'
            }
        }
        if (!idUser) {
            return {
                err: 2,
                message: 'ID user is required'
            }
        }

        const data = await db.Appointment.findAll({
            where:{ [Op.and]: [{ id_patient: idUser }, { id_doctor: idDoctor },{status:3}] },
            attributes:['appointment_date','time','id']
        })

        return{
            err:0,
            message:"Get appointment of user follow doctor",
            data:data
        }

    } catch (error) {
        console.log("Lỗi ở getAppointmentOfUserFollowDoctor: ", error);
        return {
            err: -999,
            message: `Server error: ${error}`
        }
    }
}

export {
    createDoctor, getDoctors, getDoctorById,
    deleteDoctorById, updateDoctor, getDoctorFollowSpecialty,
    getAppointmentOfUserFollowDoctor
}