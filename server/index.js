const express = require('express')
const cors = require('cors')
require('dotenv').config()
// const pool = require('./config/db')
const userRoutes = require('./routes/userRoutes')
const movieRoutes = require('./routes/movieRoutes')
const errorHandling = require('./middleware/errorHandler')
const createTables = require('./data/createUserTable')

const app = express()
const port = process.env.PORT || 9000

// middleware
app.use(cors())
app.use(express.json())

// ROUTES //
app.use("/api", userRoutes)
app.use("/api", movieRoutes)

// error handling
app.use(errorHandling)

// creating table before starting server
createTables()


app.get('/', (req, res) => {
    res.json({ message: "homepage" })
})

if (require.main === module) {
    app.listen(port, () => {
        console.log(`app running on ${port}`)
    })
}

module.exports = app;