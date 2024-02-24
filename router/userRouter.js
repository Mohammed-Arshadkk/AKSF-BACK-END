/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

// eslint-disable-next-line max-len
const {postSignUp, login, sendotp, otpVerification} = require('../controllers/userController');
const TournamentController = require('../controllers/ConductTournament');
// const AdminController = require('../controllers/AdminController');++

// User routes
router.post('/signup', postSignUp);
router.post('/login', login);
router.post('/sendotp', sendotp);
router.post('/verify-otp', otpVerification);
// Tournament routes
router.post('/conduct-tournament', TournamentController);

module.exports = router;
