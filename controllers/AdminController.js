const Tournament = require('../models/ConductTournament');
// const JoinRequest = require('../models/JoinRequest');

const AdminController = {
  joinRequests: async (req, res) => {
    try {
      const TournamentData = await Tournament.find({verified: false});
      if (!TournamentData || TournamentData.length === 0) {
        // eslint-disable-next-line max-len
        return res
            .status(404)
            .json({message: 'No unverified tournaments found'});
      }
      return res.status(200).json({message: 'Success', data: TournamentData});
    } catch (error) {
      console.error('Error fetching unverified tournaments:', error);
      return res.status(500).json({message: 'Internal server error'});
    }
  },

  verifyTournament: async (req, res) => {
    const tournamentId = req.params.id;

    try {
      const tournament = await Tournament.findById(tournamentId);
      if (!tournament) {
        return res.status(404).json({message: 'Tournament not found'});
      }

      tournament.verified = true;
      await tournament.save();

      // eslint-disable-next-line max-len
      return res
          .status(200)
          .json({message: 'Tournament verified successfully'});
    } catch (error) {
      console.error('Error verifying tournament:', error);
      return res.status(500).json({message: 'Internal server error'});
    }
  },

  approveRequest: async (req, res) => {
    const requestId = req.params.id;

    try {
      const request = await JoinRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({message: 'Join request not found'});
      }

      request.approved = true;
      await request.save();

      return res
          .status(200)
          .json({message: 'Join request approved successfully'});
    } catch (error) {
      console.error('Error approving join request:', error);
      return res.status(500).json({message: 'Internal server error'});
    }
  },
};

module.exports = AdminController;
