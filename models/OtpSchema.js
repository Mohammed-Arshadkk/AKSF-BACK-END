const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  otp: {
    type: Number,
  },
  userID: {
    type: mongoose.Schema.Types.ObjectId,
  },
  email: {
    type: String,
  },
});

const otp = mongoose.model('otp', OtpSchema);

module.exports = otp;
