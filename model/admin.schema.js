// Userschema.js (model folder)
const mongoose = require("mongoose");


const adminSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    name: {
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

const AdminCollection = mongoose.model("admin", adminSchema);

module.exports = { AdminCollection };

// app.js

 