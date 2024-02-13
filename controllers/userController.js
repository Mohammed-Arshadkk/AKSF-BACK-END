const Twilio = require("twilio");
const users = require("../models/userSchema");
const e = require("express");
require("dotenv").config();
// const SID = process.env.TWILIO_ACCOUNT_SID;
// const AUTH = process.env.TWILIO_AUTH_TOKEN;
// const SERVICE = process.env.SERVICE_ID;
const bcrypt = require("bcrypt");

// const client = Twilio(SID, AUTH);
// const userSchema = require('../')

const UserObject = {
  postSignUp: async (req, res) => {
    const { userName, email, password, number } = req.body;
    console.log(userName, email, password, number);

    const existingUser = await users.findOne({
      email: email,
    });

    if (!existingUser) {
      const hashedPass = await bcrypt.hash(password,10)
      const newUser = new users({
        userName: userName,
        email: email,
        password: hashedPass,
        number: number,
      });
      newUser.save();
      res.status(200).json({ message: "signup success" });
    } else {
      res.status(400).json({ error: "user is already exists" });
    }
    // if(existingUser){
    //     res.status(200).json({error : 'user already exists'})
    // }else{
    //     res.status(500).json({message : 'signup successfully'})
    //     console.log('signup  has succesfully done')
    // client.verify.v2
    // .services(SERVICE)
    // .verifications.create({ to: `+91${number}`, channel: "sms" })
    // .then((verification) => console.log(verification.status));

    // }
  },

  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const existingUser = await users.findOne({ userName: username });
      if (existingUser) {
        const ValidPassword = bcrypt.compareSync(
          password,
          existingUser.password
        );
       
        if (ValidPassword) {
          res.status(200).json({ message: "Login success" });
        }else{
          res.status(400).json({ message: "Wrong Password" });
        }
      } else {
        res.status(400).json({ error: "Invalid username or password" });
      }
    } catch (err) {
      res.status(500).json({ error: "there is no existing user" });
    }
  },
};

module.exports = UserObject;
