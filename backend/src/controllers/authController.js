import { createJWT, createRefreshToken } from '../middleware/JWTaction'
import { register, login, loginDoctor, changePasswordDoctor } from '../services/authServices'
import jwt from 'jsonwebtoken'
require('dotenv').config()

const handleRegister = async (req, res) => {
    try {
        const data = req.body
        const message = await register(data)

        return res.status(200).json(message)

    } catch (error) {
        console.log(`Lỗi ở handleRegister: `, error);
    }
}

const handleLogin = async (req, res) => {
    try {
        const data = req.body
        const message = await login(data)
        const { refreshToken, ...response } = message
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: false,
        })

        return res.status(200).json(response)

    } catch (error) {
        console.log("Lỗi ở handleLogin: ", error);
    }
}

const requestRefreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            return res.status(401).json("You're not authenticate !")
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, decode) => {
            let { iat, exp, ...data } = decode
            const newAccessToken = createJWT(data)
            const newRefreshToken = createRefreshToken(data)
            // console.log('check decode:  ', data);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: false,
            })

            return res.status(200).json({ token: newAccessToken })
        })
    } catch (error) {
        console.log("requestRefreshToken: ", error);
    }
}

const handleLogout = async (req, res) => {
    try {
        res.clearCookie("refreshToken")

        return res.status(200).json({
            err: 0,
            message: "Log out success"
        })
    } catch (error) {
        console.log("Lỗi ở handleLogout ", error);
        return res.status(200).json({
            err: 1,
            message: "Log out false"
        })
    }
}

const handleCheckAdmin = async (req, res, next) => {
    try {
        if (req?.user?.role === "R1") {
            next()
            // return res.status(200).json({
            //     err: 0,
            //     message: "You are admin"
            // })
        }
        else {
            return res.status(403).json({
                err: 403,
                message: "You do not have permission to do so"
            })
        }

    } catch (error) {
        console.log("Lỗi ở handleCheckAdmin", error);
        return res.status(200).json({
            err: 999,
            message: "Error Server"
        })
    }
}

const handleLoginDoctor = async (req, res) => {
    try {
        const data = req.body
        const message = await loginDoctor(data)
        const { refreshToken, ...response } = message
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: false,
        })

        return res.status(200).json(response)
    } catch (error) {
        console.log("Lỗi ở handleLoginDoctor", error);
        return res.status(200).json({
            err: 999,
            message: "Error Server"
        })
    }
}

const handleChangePasswordDoctor = async (req, res) => {
    try {
        const { idDoctor, oldPassword, newPassword } = req.body
        const message = await changePasswordDoctor(idDoctor, oldPassword, newPassword)
        return res.status(200).json(message)
    } catch (error) {
        console.log("Lỗi ở handleChangePasswordDoctor", error);
    }
}


export {
    handleRegister, handleLogin, requestRefreshToken, handleLogout,
    handleCheckAdmin, handleLoginDoctor, handleChangePasswordDoctor
}