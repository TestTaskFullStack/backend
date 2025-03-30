import mongoose from 'mongoose';
 
const CommentSchema  = new mongoose.Schema({
    text: {
      type: String,
      required: true,
      unique: false, 
      uppercase: false 
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  }, {
    timestamps: true 
  });
 
const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;