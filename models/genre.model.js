import mongoose from 'mongoose';
 
const GenreSchema  = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true, 
      uppercase: true 
    }
  }, {
    timestamps: true 
  });
 
const Genre = mongoose.model('Genre', GenreSchema);
export default Genre;