const express = require('express')
const router = express.Router()
const { registerUser, loginUser, getMe } = require('../controller/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/users/register', registerUser)
router.post('/users/login', loginUser)
router.get('/users/me', protect, getMe)

module.exports = router