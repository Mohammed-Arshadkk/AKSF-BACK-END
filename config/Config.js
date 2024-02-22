const mongoose = require('mongoose');

/**
 * Function to connect database
 */
function connectDB() {
  mongoose.connect('mongodb://127.0.0.1:27017/AKSF');
  console.log('Database is connected');
}


module.exports = connectDB;
