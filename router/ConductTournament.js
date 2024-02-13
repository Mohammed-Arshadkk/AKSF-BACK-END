const express = require('express');
const router = express.Router();

const { conductTournament } = require('../controllers/ConductTournament');

router.post('/conductTournament', conductTournament);

module.exports = router;
