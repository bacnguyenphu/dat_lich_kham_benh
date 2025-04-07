const express = require('express')
const router = express.Router()

import { handleLogin, handleRegister } from '../controllers/authController'

router.post('/register',handleRegister)
router.post('/login',handleLogin)

export default router