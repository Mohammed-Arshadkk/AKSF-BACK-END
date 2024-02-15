const express = require('express')
const router = express.Router()

const {postSignUp, login} = require('../controllers/userController')

router.post('/signup',postSignUp)
router.post('/login',login)


module.exports = router;