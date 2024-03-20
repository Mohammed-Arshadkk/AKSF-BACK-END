const express = require('express');
const router = express.Router();
const otpVery = require('../middleware/otpVerfication');
const {postSignUp, login,
  sendotp, otpVerification, resetPassword, conductTournament} =
 require('../controllers/userController');


// User routes
router.post('/signup', postSignUp);
router.post('/login', login);
router.post('/sendotp', sendotp);
router.post('/otpVerification', otpVerification);
router.post('/reset-password', otpVery, resetPassword);

// Tournament routes
router.post('/conduct-tournament', conductTournament);


module.exports = router;
