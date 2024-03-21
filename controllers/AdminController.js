const Tournament = require('../models/ConductTournament');

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

  // verifyTournament: async (req, res) => {
  //   const tournamentId = req.params.id;

  //   try {
  //     const tournament = await Tournament.findById(tournamentId);
  //     if (!tournament) {
  //       return res.status(404).json({message: 'Tournament not found'});
  //     }

  //     tournament.verified = true;
  //     await tournament.save();

  //     // eslint-disable-next-line max-len
  //     return res
  //         .status(200)
  //         .json({message: 'Tournament verified successfully'});
  //   } catch (error) {
  //     console.error('Error verifying tournament:', error);
  //     return res.status(500).json({message: 'Internal server error'});
  //   }
  // },

  approveRequest: async (req, res) => {
    const requestId = req.params.id;

    try {
      const request = await Tournament.findById(requestId);
      if (!request) {
        return res.status(404).json({message: 'Join request not found'});
      }

      request.verified = true;
      await request.save();

      return res
          .status(200)
          .json({message: 'Join request approved successfully'});
    } catch (error) {
      console.error('Error approving join request:', error);
      return res.status(500).json({message: 'Internal server error'});
    }
  },

  approvedClubs: async (req, res) => {
    try {
      const approvedClubs = await Tournament.find({verified: true});
      console.log(approvedClubs);
      if (!approvedClubs || approvedClubs.length === 0) {
        return res.status(404).json({message: 'No approved Clubs found'});
      }
      return res.status(200).json({message: 'Success', data: approvedClubs});
    } catch (error) {
      console.error('Error fetching approved clubs:', error);
      return res.status(500).json({message: 'Internal server error'});
    }
  },

  // verifiedOrNot: async (req, res) =>{
  //   console.log(req.decodedToken, 'decoded token is here');
  //   const id = req.decodedToken.id;
  //   const checkVerifiedOrNot = await Tournament.findById({_id: id});
  //   console.log(checkVerifiedOrNot);
  // },
};

module.exports = AdminController;
