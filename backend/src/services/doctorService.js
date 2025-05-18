import db from '../models/index'
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";

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
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            phone: data.phone,
            email: data.email,
            password: hashPass(data.password),
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            address: data.address,
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
        }

        if (data.id_specialty.length > 0) {
            for (const item of data.id_specialty) {
                await db.Specialty_doctor.create({
                    id_doctor: id_doctor,
                    id_specialty: item
                })
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

const getDoctors = async () => {
    try {
        const data = await db.Doctor.findAll({
            attributes: ['id', 'description', 'price', 'createdAt',],
            include: [
                { model: db.User, as: 'user', attributes: ['firstName', 'lastName', 'phone', 'email', 'dateOfBirth', 'gender', 'address', 'avatar'] },
                { model: db.Position, as: 'position', attributes: ['name'],through: { attributes: [] } },
                { model: db.Specialty, as: 'specialty', attributes: ['name'],through: { attributes: [] } }
            ]
        })
        return {
            err: 0,
            message: "Get doctors success!",
            data
        }

    } catch (error) {
        console.log("Lỗi ở getDoctors: ", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}


export { createDoctor, getDoctors }