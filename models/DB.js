const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {});
    console.log("mongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
