const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();

const {postSignUp, login, sendotp} = require('../controllers/userController');

router.post('/signup', postSignUp);
router.post('/login', login);
router.post('/sendotp', sendotp);

module.exports = router;
