const Users = require('../models/userSchema');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const otp = require('../models/OtpSchema');
const nodemailer = require('nodemailer');

// Creating transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

maxAge = 3 * 24 * 60 * 60;

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

        const existMail=await otp.findOne({email: email});
        if (existMail) {
          const updateOtp = await otp.findByIdAndUpdate(
              {_id: existMail._id},
              {userID: existingUser._id, otp: OTP},
              {new: true},
          );
          await updateOtp.save();
        } else {
          const updateData = new otp({
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
};

module.exports = UserObject;
