// Userschema.js (model folder)
const mongoose = require("mongoose");
const nid = require("nid");

const postSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    imageUrl: {
        type: String
      },
    createdBy: {
        type: String,
        default: "SYSTEM",
       
        
      },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
virtuals: true },
  }
);

const PostCollection = mongoose.model("posts", postSchema);

module.exports = { PostCollection };

// app.js

 