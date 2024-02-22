/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();

const {postSignUp, login, sendotp} = require('../controllers/userController');
const TournamentController = require('../controllers/ConductTournament');
// const AdminController = require('../controllers/AdminController');++

// User routes
router.post('/signup', postSignUp);
router.post('/login', login);
router.post('/sendotp', sendotp);

// Tournament routes
router.post('/conduct-tournament', TournamentController);

module.exports = router;
