const Tournament = require('../models/ConductTournament');
const Twilio = require('twilio');
require('dotenv').config();
const bcrypt = require('bcrypt');
const cdSchema = require('../models/ConductTournament');

const SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH = process.env.TWILIO_AUTH_TOKEN;
const SERVICE = process.env.SERVICE_ID;
console.log(SID, AUTH);

const client = require('twilio')(SID, AUTH);

// Function to check if password is strong
const isPasswordStrong = (password) => {
  const SpecialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
  return password.length >= 8 && SpecialCharacters.test(password);
};

const TournamentController = {
  conductTournament: async (req, res) => {
    const {
      clubName,
      password,
      place,
      phoneNumber,
      startDate,
      endDate,
      secretaryName,
      presidentName,
      sponsorship,
      winnersPrice,
      runnersPrice,
    } = req.body;

    if (!isPasswordStrong(password)) {
      return res.status(400).json({
        message:
          // eslint-disable-next-line max-len
          'Password is not strong enough.Please use a password with at least 8 characters.',
      });
    }

    try {
      const existingTournament = await Tournament.findOne({clubName});
      if (existingTournament) {
        return res.status(400).json({
          message:
            // eslint-disable-next-line max-len
            'A tournament with this club name already exists. Please choose a different club name.',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newTournament = new Tournament({
        clubName,
        password: hashedPassword,
        place,
        phoneNumber,
        startDate,
        endDate,
        secretaryName,
        presidentName,
        sponsorship,
        winnersPrice,
        runnersPrice,
      });

      await newTournament.save();

      // Send SMS notifications to participants
      await client.verify.v2
          .services(SERVICE)
          .verifications.create({to: `+91${phoneNumber}`, channel: 'sms'});
      // res.status(200).json({message:'Otp send successfully'})
      res.status(200).json({message: 'Tournament conducted successfully!'});
    } catch (error) {
      console.error('Error conducting tournament:', error);
      res.status(500).json({
        message: 'Failed to conduct tournament. Please try again later.',
      });
    }
  },
  Cdlogin: async (req, res) => {
    const {clubName, password} = req.body;

    try {
      const checkCdTournament = await cdSchema.findOne({clubName});

      if (checkCdTournament) {
        const passwordCheck = bcrypt.compareSync(
            password,
            checkCdTournament.password,
        );

        if (!passwordCheck) {
          res.status(400).json({message: 'Password does not match'});
        } else {
          res.status(200).json({message: 'Logged in successfully'});
        }
      } else {
        res.status(400).json({message: 'Clubname does not match'});
      }
    } catch (err) {
      res.status(500).json({message: 'Login error'});
    }
  },
};

module.exports = TournamentController;
