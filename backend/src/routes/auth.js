const express = require('express')
const router = express.Router()

import { handleLogin, handleLogout, handleRegister, handleCheckAdmin, requestRefreshToken, handleLoginDoctor } from '../controllers/authController'
import { checkUserJWT } from '../middleware/JWTaction'

router.post('/register',handleRegister)
router.post('/login',handleLogin)
router.post("/refresh-token",requestRefreshToken)
router.post("/logout",handleLogout)
router.get("/navigate-admin",checkUserJWT,handleCheckAdmin)

router.post("/login-doctor",handleLoginDoctor)

export default router