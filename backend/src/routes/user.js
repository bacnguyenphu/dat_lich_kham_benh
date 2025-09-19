const express = require('express')
const { handleGetUsers, handleGetUserById, handleUpdateUser, handleDeleteUserById } = require('../controllers/userController')
const router = express.Router()

router.get('/get-users', handleGetUsers)
router.get('/get-user-by-id',handleGetUserById)
router.post('/update-user',handleUpdateUser)
router.delete('/delete-user',handleDeleteUserById)

export default router