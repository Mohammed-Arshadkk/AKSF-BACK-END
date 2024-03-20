const express = require('express');
const router = express.Router();
const {
  verifyTournament, joinRequests, approveRequest
}= require('../controllers/AdminController');

// Route to get the admin home page
router.get('/adminHome', (req, res) => {
  // Implement your admin home logic here
});

// Route to get the list of unverified tournaments
router.get('/joinRequests', joinRequests);

// Route to verify a tournament by ID
router.put('/verifyTournament/:id', verifyTournament);
router.put('/approveRequests/:id', approveRequest);

module.exports = router;
