import { DELETE_USER, GET_USER_BY_ID, GET_USERS, UPDATE_USER } from '../utils/routeUrlApi'

const express = require('express')
const { handleGetUsers, handleGetUserById, handleUpdateUser, handleDeleteUserById } = require('../controllers/userController')
const router = express.Router()

router.get(GET_USERS, handleGetUsers)
router.get(GET_USER_BY_ID, handleGetUserById)
router.post(UPDATE_USER, handleUpdateUser)
router.delete(DELETE_USER, handleDeleteUserById)

export default router