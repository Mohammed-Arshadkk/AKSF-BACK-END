const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  // number : {
  //     type : Number,
  //     required : true
  // }

});

const users = new mongoose.model('usercollections', userSchema);

module.exports = users;
