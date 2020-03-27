const mongoose = require("mongoose");
const User = require("./usermodel");
const moment = require("moment");

const PostSchema = new mongoose.Schema({
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "_Class",
    required: true
  },
  author: {
    type: String,
    required: true
  },
  time: {
    type: String
  },
  content: {
    type: String,
    required: true
  },
  attachment: {
    type: Buffer
  },

  comments: [
    {
      comment: {
        type: String,
        required: true
      },
      post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      },
      author: {
        type: String
      },
      time: {
        type: String,
        required: true,
        default: moment().format("MMM Do, h:mm a")
      }
    }
  ]
});

PostSchema.pre("save", function() {
  this.time = moment().format("MMM Do YYYY, h:mm a");
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
