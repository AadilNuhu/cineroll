const express = require('express')
const cors = require('cors')
require('dotenv').config()
// const pool = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const movieRoutes = require('./routes/movieRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const errorHandling = require('./middleware/errorHandler')
const createTables = require('./data/createUserTable')

const app = express()
const port = process.env.PORT || 9000

// middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// ROUTES //
app.use("/api", userRoutes)
app.use("/api", movieRoutes)
app.use("/api", uploadRoutes)

// error handling
app.use(errorHandling)

// creating table before starting server
createTables()


app.get('/', (req, res) => {
    res.json({ message: "homepage" })
})


app.listen(port, () => {
    console.log(`app running on ${port}`)
})