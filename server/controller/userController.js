const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data
    })
}

const registerUser = async (req, res, next) => {
    const { name, email, password } = req.body
    try {
        if (!name || !email || !password) return handleResponse(res, 400, "Missing fields")

        const existingUser = await userModel.getUserByEmail(email)
        if (existingUser) return handleResponse(res, 400, "User already exists")

        const salt = await bcrypt.genSalt(10)
        const password_hash = await bcrypt.hash(password, salt)

        const newUser = await userModel.createUser(name, email, password_hash)

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })

        handleResponse(res, 201, "User registered successfully", { user: newUser, token })
    } catch (error) {
        next(error)
    }
}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body
    try {
        if (!email || !password) return handleResponse(res, 400, "Missing fields")

        const user = await userModel.getUserByEmail(email)
        if (!user) return handleResponse(res, 404, "Invalid credentials")

        const isMatch = await bcrypt.compare(password, user.password_hash)
        if (!isMatch) return handleResponse(res, 401, "Invalid credentials")

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })

        // Remove hash from response
        delete user.password_hash;
        handleResponse(res, 200, "Login successful", { user, token })
    } catch (error) {
        next(error)
    }
}

const getMe = async (req, res, next) => {
    try {
        const user = await userModel.getUserById(req.user.id)
        if (!user) return handleResponse(res, 404, "User not found")
        handleResponse(res, 200, "User fetched successfully", user)
    } catch (error) {
        next(error)
    }
}

module.exports = { registerUser, loginUser, getMe }