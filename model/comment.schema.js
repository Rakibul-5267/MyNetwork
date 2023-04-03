
const mongoose = require("mongoose");
const nid = require("nid");

const commentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    postId: {
        type: String,
        required: true,
      },
    comment: {
      type: String,
      required: true,
    },
    commentsId: {
        type: String,
        required: true,
      },
      likes: {
        type: [Object],
        required: true,
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

const CommentCollection = mongoose.model("comments", commentSchema);                                              

module.exports = { CommentCollection };



 