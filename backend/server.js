const express = require('express')
import cors from 'cors'
import connectDB from './src/config/connectDB'
import initRoutes from './src/routes/index'
import cookieParser from "cookie-parser";

require('dotenv').config()
const port = process.env.PORT || 8888


const app = express()
app.use(cors({
  // origin: process.env.URL_CLIENT, // domain frontend
  origin: true,
  credentials: true,               // cho phép gửi cookie
}));
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

initRoutes(app)

connectDB()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})