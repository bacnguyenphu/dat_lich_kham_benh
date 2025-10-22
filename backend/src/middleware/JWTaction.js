import jwt from 'jsonwebtoken'
require('dotenv').config()

export const createRefreshToken = (payload) => {
    let token = null
    try {
        token = jwt.sign(payload, process.env.JWT_REFRESH_KEY, { expiresIn: "365d" })
    } catch (error) {
        console.log("Lỗi ở createRefreshToken", error);
    }
    return token
}

export const createJWT = (payload) => {
    let token = null
    try {
        token = jwt.sign(payload, process.env.JWT_ACCESS_KEY, { expiresIn: "2h" })
    } catch (error) {
        console.log("Lỗi ở createJWT", error);
    }
    return token
}

export const verifyJWT = (token) => {
    let decode = null
    try {
        decode = jwt.verify(token, process.env.JWT_ACCESS_KEY)
    } catch (error) {
        console.log("Lỗi ở verifyJWT");

    }
    return decode
}

export const checkUserJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const decode = verifyJWT(authHeader.split(" ")[1])
        if (decode) {
            req.user = decode
            next()
        }
        else {
            return res.status(401).json({
                err: 401,
                message: "Token is not valid"
            })
        }
    }
    else {
        return res.status(401).json({
            err: 401,
            message: "Not authenticated the user"
        })
    }
}
