const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
// eslint-disable-next-line max-len
const Tournament = require('../models/ConductTournament'); // Assuming Tournament is the correct model
const cdSchema = require('../models/ConductTournament');

// Function to check if password is strong
const isPasswordStrong = (password) => {
  const SpecialCharacters = /[!@#$%^&*(),.?":{}|<>]/;
  return password.length >= 8 && SpecialCharacters.test(password);
};

// Conduct Tournament route
router.post('/conduct-tournament', async (req, res) => {
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
      // eslint-disable-next-line max-len
      message: 'Password is not strong enough. Please use a password with at least 8 characters.',
    });
  }

  try {
    const existingTournament = await Tournament.findOne({clubName});
    if (existingTournament) {
      return res.status(400).json({
        // eslint-disable-next-line max-len
        message: 'A tournament with this club name already exists. Please choose a different club name.',
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

    // Send request to admin
    await sendAdminRequest(clubName);

    res.status(200).json({message: 'Request sent to admin for approval'});
  } catch (error) {
    console.error('Error conducting tournament:', error);
    res.status(500).json({
      message: 'Failed to conduct tournament. Please try again later.',
    });
  }
});

// Tournament login route
router.post('/cd-login', async (req, res) => {
  const {clubName, password} = req.body;

  try {
    const checkCdTournament = await cdSchema.findOne({clubName});

    if (checkCdTournament) {
      // eslint-disable-next-line max-len
      const passwordCheck = bcrypt.compareSync(password, checkCdTournament.password);

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
});

// Function to send admin request
// eslint-disable-next-line require-jsdoc
async function sendAdminRequest(clubName) {
  console.log(`Request sent to admin for club: ${clubName}`);
}

module.exports = router;
