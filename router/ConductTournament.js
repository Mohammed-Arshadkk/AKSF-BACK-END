const express = require('express');
const router = express.Router();

const { conductTournament } = require('../controllers/ConductTournament');

router.post('/conduct', conductTournament);

module.exports = router;
