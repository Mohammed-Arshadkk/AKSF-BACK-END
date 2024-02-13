const Tournament = require('../models/ConductTournament');
const Twilio = require('twilio');
require('dotenv').config();

const SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH = process.env.TWILIO_AUTH_TOKEN;
const SERVICE = process.env.TWILIO_VERIFY_SERVICE_ID;

const client = Twilio(SID, AUTH);

const TournamentController = {
    conductTournament: async (req, res) => {
        const {
            clubName,
            place,
            phoneNumber,
            startDate,
            endDate,
            secretaryName,
            presidentName,
            sponsorship,
            winnersPrice,
            runnersPrice
        } = req.body;

        // Create a new tournament document
        const newTournament = new Tournament({
            clubName,
            place,
            phoneNumber,
            startDate,
            endDate,
            secretaryName,
            presidentName,
            sponsorship,
            winnersPrice,
            runnersPrice
        });

        try {
            // Save the tournament details to the database
            await newTournament.save();

            // Send SMS notifications to participants (example)
            client.verify.services(SERVICE)
                .verifications
                .create({ to: `+91${phoneNumber}`, channel: 'sms' })
                .then(verification => console.log(verification.status));

            // Respond with success message
            res.status(200).json({ message: 'Tournament conducted successfully!' });



        } catch (error) {
            // Handle errors
            console.error('Error conducting tournament:', error);
            res.status(500).json({ message: 'Failed to conduct tournament. Please try again later.' });
        }
    }
};

module.exports = TournamentController;


