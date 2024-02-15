const Twilio = require("twilio");
const users = require("../models/userSchema");
const e = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// const SID = process.env.TWILIO_ACCOUNT_SID;
// const AUTH = process.env.TWILIO_AUTH_TOKEN;
// const SERVICE = process.env.SERVICE_ID;
const bcrypt = require("bcrypt");

// const client = Twilio(SID, AUTH);
// const userSchema = require('../')

maxAge=3*24*60*60
const createToken=(id)=>{
  return jwt.sign({id}, process.env.ACCESS_TOKEN,{expiresIn:maxAge} );
}

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

      // token created
      const token = createToken(newUser._id)
      console.log(token);
      res.cookie("jwt", token, {
        httponly: true,
        maxAge: maxAge * 1000,
        secure: true,
      });
      console.log("userController", token);

      res.status(200).json({ message: "signup success", token });
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
};

module.exports = UserObject;
