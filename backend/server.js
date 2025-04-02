const express = require('express')
import cors from 'cors'
import connectDB from './src/config/connectDB'
require('dotenv').config()
const port = process.env.PORT || 8888


const app = express()
app.use(cors())
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDB()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})