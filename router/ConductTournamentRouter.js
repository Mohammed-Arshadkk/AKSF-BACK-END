const express = require('express');
const router = express.Router();
const { conductTournament,Cdlogin } = require('../controllers/ConductTournament');

router.post('/conductTournament', conductTournament);


router.post('/Cdlogin',Cdlogin);

module.exports = router;
