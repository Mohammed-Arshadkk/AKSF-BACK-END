const express = require('express');
const otpVery = require('../middleware/otpVerfication');

const router = express.Router();
const {
  joinRequests, approveRequest, approvedClubs, verifiedOrNot
}= require('../controllers/AdminController');
const { otpVerification } = require('../controllers/userController');


// Route to get the list of unverified tournaments
router.get('/joinRequests', joinRequests);
router.get('/approvedClubs', approvedClubs);

// Route to verify a tournament by ID
// router.put('/verifyTournament/:id', verifyTournament);
// router.get('/verified', otpVery , verifiedOrNot);
router.put('/approveRequests/:id', approveRequest);

module.exports = router;
