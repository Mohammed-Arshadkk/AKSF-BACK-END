const users = require("../models/userSchema");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Creating transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN, { expiresIn: maxAge });
};

const UserObject = {
  postSignUp: async (req, res) => {
    const { userName, email, password } = req.body;
    console.log(userName, email, password);

    const existingUser = await users.findOne({
      email: email,
    });

    if (!existingUser) {
      const hashedPass = await bcrypt.hash(password, 10);
      const newUser = new users({
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
        html: `<p>Hello ${userName},</p><p>Please click <a href="${process.env.BASE_URL}/verify/${token}">here</a> to verify your account.</p>`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.status(200).json({ message: "signup success, verification email sent", token });
    } else {
      res.status(400).json({ error: "user is already exists" });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const existingUser = await users.findOne({ userName: username });
      if (existingUser) {
        const validPassword = bcrypt.compareSync(password, existingUser.password);

        if (validPassword) {
          res.status(200).json({ message: "Login success" });
        } else {
          res.status(400).json({ message: "Wrong Password" });
        }
      } else {
        res.status(400).json({ error: "Invalid username" });
      }
    } catch (err) {
      res.status(500).json({ error: "there is no existing user" });
    }
  },
  // sendotp: async (req,res) => {
  //   const {email} = req.body

  //   try {
  //     const existingUsermail = await users.findOne({email:email})
  //   }
  // }
};

module.exports = UserObject;
