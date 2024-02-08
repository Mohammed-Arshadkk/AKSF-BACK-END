const  Twilio  = require('twilio')
const users = require('../models/userSchema')
require('dotenv').config()
const SID = process.env.TWILIO_ACCOUNT_SID
const AUTH = process.env.TWILIO_AUTH_TOKEN
const SERVICE = process.env.SERVICE_ID

const client = Twilio(SID,AUTH)
// const userSchema = require('../')

const UserObject = {
    postSignUp : async(req,res)=>{
        const {userName,email,password,number} = req.body
        console.log(userName,email,password,number)
        client.verify.v2.services(SERVICE)
                .verifications
                .create({to: `+91${number}`, channel: 'sms'})
                .then(verification => console.log(verification.status));
        const newUser = new users({
            userName:userName,
            email:email,
            password:password,
            number:number
        })
        newUser.save()
    }
}

module.exports = UserObject