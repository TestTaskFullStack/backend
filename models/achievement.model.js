import mongoose from 'mongoose';
 
const AchievementSchema  = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      unique: true, 
      uppercase: false 
    },
    description: {
      type: String,
      required: true,
      unique: false, 
      uppercase: false 
    }
  }, {
    timestamps: true 
  });
 
const Achievement = mongoose.model('Achievement', AchievementSchema);
export default Achievement;
