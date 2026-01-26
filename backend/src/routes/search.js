import { SEARCH } from '../utils/routeUrlApi'

const express = require('express')
const { handleSearch } = require('../controllers/searchController')
const router = express.Router()

router.get(SEARCH, handleSearch)

export default router