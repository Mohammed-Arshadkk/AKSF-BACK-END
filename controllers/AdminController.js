// adminController.js
const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');

// Approve Tournament route
router.put('/approve-tournament/:id', async (req, res) => {
  const tournamentId = req.params.id;

  try {
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({message: 'Tournament not found'});
    }

    // Update tournament status to approved
    tournament.status = 'approved';
    await tournament.save();

    return res.status(200).json({message: 'Tournament approved successfully'});
  } catch (error) {
    console.error('Error approving tournament:', error);
    return res.status(500).json({message: 'Failed to approve tournament'});
  }
});

module.exports = router;
