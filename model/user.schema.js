// Userschema.js (model folder)
const mongoose = require("mongoose");
const nid = require("nid");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: nid(17),
    },
    name: {
      type: String,
      required: true,
    },
    username: {
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
    gender: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
     
    },
    city: {
      type: String,
     
    },
    country: {
      type: String,
      
    },
    coverimgUrl: {
      type: String
    },
    profileimgUrl: {
      type: String
    },
    about: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
virtuals: true },
  }
);

const UserCollection = mongoose.model("users", userSchema);

module.exports = { UserCollection };

// app.js

 