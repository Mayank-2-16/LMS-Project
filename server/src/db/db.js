// import mongoose from "mongoose";
const mongoose = require('mongoose');

const connecttoDB = async () => {
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/test");
        console.log(`MongoDB Connected`);
    }catch(err){
        console.error("Database connection issue: ", err.message);
        process.exit(1);
    }
}

connecttoDB();

module.exports = connecttoDB;