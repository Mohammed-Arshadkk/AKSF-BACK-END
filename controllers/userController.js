const Users = require('../models/userSchema');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const otpShema = require('../models/OtpSchema');
const nodemailer = require('nodemailer');
const ConductTournament = require('../models/ConductTournament');

// Creating transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

maxAge = 3 * 24 * 60 * 60;

// jwt token
const createToken = (id) => {
  return jwt.sign({id}, process.env.ACCESS_TOKEN, {expiresIn: maxAge});
};

const UserObject = {
  // Signup the user
  postSignUp: async (req, res) => {
    const {userName, email, password} = req.body;
    console.log(userName, email, password);

    const existingUser = await Users.findOne({
      email: email,
    });

    if (!existingUser) {
      const hashedPass = await bcrypt.hash(password, 10);
      const newUser = new Users({
        userName: userName,
        email: email,
        password: hashedPass,
      });
      newUser.save();

      // Send verification email
      const token = createToken(newUser._id);
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Account Verification',
        html: `<p>Hello ${userName},</p><p>Please click 
        <a href="${process.env.BASE_URL}/verify/${token}">here</a> to 
        verify your account.</p>`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res
          .status(200)
          .json({message: 'signup success, verification email sent', token});
    } else {
      res.status(400).json({error: 'user is already exists'});
    }
  },
  // Login the user
  login: async (req, res) => {
    const {username, password} = req.body;

    try {
      const existingUser = await Users.findOne({userName: username});
      if (existingUser) {
        const validPassword = bcrypt.compareSync(
            password,
            existingUser.password,
        );

        if (validPassword) {
          res.status(200).json({message: 'Login success'});
        } else {
          res.status(400).json({message: 'Wrong Password'});
        }
      } else {
        res.status(400).json({error: 'Invalid username'});
      }
    } catch (err) {
      res.status(500).json({error: 'there is no existing user'});
    }
  },
  // send otp to the user mail
  sendotp: async (req, res) => {
    const {email} = req.body;

    try {
      const existingUser = await Users.findOne({email});

      if (existingUser) {
        const OTP = Math.floor(100000 + Math.random() * 900000);

        const existMail = await otpShema.findOne({email: email});
        if (existMail) {
          const updateOtp = await otpShema.findByIdAndUpdate(
              {_id: existMail._id},
              {userID: existingUser._id, otp: OTP},
              {new: true},
          );
          await updateOtp.save();
        } else {
          // eslint-disable-next-line new-cap
          const updateData = new otpShema({
            userID: existingUser._id,
            email: email,
            otp: OTP,
          });
          await updateData.save();
        }

        console.log('otp :', OTP);
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: 'OTP verification',
          text: `Your OTP: ${OTP}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error); // Log the error for debugging
            res.status(500).json({error: 'Failed to send OTP'});
          } else {
            console.log('Email sent:', info.response);
            res.status(200).json({message: 'OTP Sent Successfully', OTP});
          }
        });
      } else {
        res.status(400).json({error: 'User not found'});
      }
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json({error: 'Internal server error'});
    }
  },
  otpVerification: async (req, res) => {
    try {
      const {otp} = req.body;
      console.log(otp);
      // Ensure `otp` is the correct model for querying
      const findUser = await otpShema.findOne({otp});

      if (findUser) {
        res.status(200).json({message: 'OTP is correct'});
      } else {
        // eslint-disable-next-line max-len
        res.status(404).json({message: 'OTP is incorrect'}); // Changed status to 404 for not found
      }
    } catch (error) {
      console.error('Error in OTP verification:', error);
      res.status(500).json({message: 'Internal server error'});
    }
  },
  resetPassword: async (req, res) => {
    const decodedToken = req.decodedToken;
    const userId = decodedToken.id;
    console.log(`heloooo`, userId);
    try {
      const {newPassword} = req.body;
      const user = await Users.findOne({_id: userId});

      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }

      const hashedPass = await bcrypt.hashSync(
          newPassword,
          bcrypt.genSaltSync(10),
      );
      user.password = hashedPass;
      await user.save();
      res.status(200).json({message: 'Password reset successfully.'});
    } catch (error) {
      console.error('Error resetting password:', error);

      res
          .status(500)
          .json({message: 'An error occurred while resetting the password.'});
    }
  },

  conductTournament: async (req, res) => {
    const {formData} = req.body;
    console.log(formData);

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
      verified,
    } = formData;

    const existingClub = await ConductTournament.findOne({
      clubName: formData.clubName,
    });

    try {
      if (existingClub) {
        return res
            .status(400)
            .json({message: 'A club with name is already exist'});
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newTournament = new ConductTournament({
        clubName: clubName,
        password: hashPassword,
        place: place,
        phoneNumber: phoneNumber,
        startDate: startDate,
        endDate: endDate,
        secretaryName: secretaryName,
        presidentName: presidentName,
        sponsorship: sponsorship,
        winnersPrice: winnersPrice,
        runnersPrice: runnersPrice,
        verified: verified,
      });
      await newTournament.save();

      return res
          .status(200)
          .json({message: 'Tournament Conducted Successfully !..'});
    } catch (error) {
      console.log(error);
      return res.status(500).json({message: 'Internal Server error'});
    }
  },

  cdLogin: async (req, res) => {
    const {clubName, password} = req.body;

    try {
      const existingUser = await ConductTournament
          .findOne({clubName: clubName});
      if (existingUser) {
        const validPassword = bcrypt.compareSync(
            password,
            existingUser.password,
        );

        if (validPassword) {
          res.status(200).json({message: 'Login success'});
        } else {
          res.status(400).json({message: 'Wrong Password'});
        }
      } else {
        res.status(400).json({error: 'Invalid ClubName'});
      }
    } catch (err) {
      res.status(500).json({error: 'there is no existing user'});
    }
  },


};

module.exports = UserObject;
