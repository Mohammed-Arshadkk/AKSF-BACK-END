const express = require('express')
const router = express.Router()

const {postSignUp} = require('../controllers/userController')

router.post('/signup',postSignUp)

module.exports = router