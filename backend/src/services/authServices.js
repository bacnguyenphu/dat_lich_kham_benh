import db from '../models/index'
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
import { where } from 'sequelize';

const hashPass = (password) => {
    return bcrypt.hashSync(password, 12);
}

const checkPass = (password, passwordConfirm) => {
    return bcrypt.compareSync(password, passwordConfirm);
}

const register = async (data) => {
    try {
        if (!data.phone) {
            return {
                err: -1,
                message: "Phone is required !"
            }
        }
        if (!data.password) {
            return {
                err: -2,
                message: "Password is required !"
            }
        }
        const [user, created] = await db.User.findOrCreate({
            where: { phone: data.phone },
            defaults: {
                phone: data.phone,
                id: uuidv4(),
                password: hashPass(data.password)
            }
        })

        return {
            err: created ? 0 : -3,
            message: created ? "Register success !" : "Phone is exist !"
        }

    } catch (error) {
        console.log("Lỗi ở register :", error);
        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

const login = async (data) => {
    try {
        if (!data.phone) {
            return {
                err: -1,
                message: "Phone is required !"
            }
        }
        if (!data.password) {
            return {
                err: -2,
                message: "Password is required !"
            }
        }
        const user = await db.User.findOne({
            where: {
                phone: data.phone
            }
        })

        if (!user) {
            return {
                err: -3,
                message: "Accout haven't registe"
            }
        }

        if (!checkPass(data.password, user.password)) {
            return {
                err: -4,
                message: "Password is not correct !"
            }
        }

        return {
            err: 0,
            message: "Login success !"
        }
        
    } catch (error) {
        console.log("Lỗi ở login : ", error);

        return {
            err: -999,
            message: `Error server: ${error}`
        }
    }
}

export { register, login }