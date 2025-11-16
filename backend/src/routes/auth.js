const express = require('express')
const router = express.Router()

import { handleLogin, handleLogout, handleRegister, handleCheckAdmin, requestRefreshToken, handleLoginDoctor, handleChangePasswordDoctor } from '../controllers/authController'
import { checkUserJWT } from '../middleware/JWTaction'

router.post('/register', handleRegister)
router.post('/login', handleLogin)
router.post("/refresh-token", requestRefreshToken)
router.post("/logout", handleLogout)
router.get("/navigate-admin", checkUserJWT, handleCheckAdmin,
    async (req, res) => {
        return res.status(200).json({
            err: 0,
            message: "You are admin"
        })
    }
)

router.post("/login-doctor", handleLoginDoctor)
router.post("/change-password-doctor",handleChangePasswordDoctor)

export default router