const mongoose = require('mongoose');

const ConductTournamentSchema = new mongoose.Schema({
  clubName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  secretaryName: {
    type: String,
    required: true,
  },
  presidentName: {
    type: String,
    required: true,
  },
  sponsorship: {
    type: String,
    required: true,
  },
  winnersPrice: {
    type: String,
    required: true,
  },
  runnersPrice: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('ConductTournament', ConductTournamentSchema);
