import mongoose from 'mongoose';
 
const GameSchema  =  new mongoose.Schema({
    systemGameName: { type: String, required: true, unique: true }, 
    commonGameName: { type: String, required: true },
    gameDescription: String,
    gameLaunchers: [String],
    gameImage: String,
    gameClass: String, 
    genre: String, 
    inTop: { type: Boolean, default: false },
    releaseDate: String, 
    publisher: String,
    gameVideoUrl: String,
    gameImages: [String],
    exactingness: String, 
    gameBoxArt: String,
    gameLogo: String,
    gameVideoLauncherUrl: String,
    gameHero: String
}, {
    timestamps: true 
});
 
const Game = mongoose.model('Game', GameSchema);
export default Game;