const mongoose = require('mongoose')

function connectDB(){
    mongoose.connect('mongodb://127.0.0.1:27017/AKSF')
    console.log('Database is connected');
}



module.exports = connectDB