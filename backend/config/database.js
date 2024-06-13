const mongoose = require('mongoose');
require('dotenv').config();

exports.connectDatabase=()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("Connected to Database");
    })
    .catch((err)=>{
        console.log("Failed to connect to MongoDB",err);
        process.exit();
    });
}