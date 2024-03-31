const mongoose = require("mongoose");

const peopleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  phone: {
    type: Number,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },

  logInStatus: {
    type: String,
    default: "logOut",
  },
  logInTime: {
    type: Date,
    default: null,
  },

  imageUrl: {
    type: String,
    default: null,
  },

  updatetedAt: {
    type: Date,
    default: null,
  },
});

const People = mongoose.model("client", peopleSchema);

module.exports = People;
