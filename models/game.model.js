import mongoose from "mongoose";

const GameSchema = new mongoose.Schema(
  {
    systemGameName: { type: String, required: true, unique: true },
    commonGameName: { type: String, required: true },
    gameDescription: String,
    gameLaunchers: [String],
    gameImage: String,
    gameClass: String,
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
    },
    inTop: { type: Boolean, default: false },
    releaseDate: String,
    publisher: String,
    gameVideoUrl: String,
    gameImages: [String],
    exactingness: String,
    gameBoxArt: String,
    gameLogo: String,
    gameVideoLauncherUrl: String,
    gameHero: String,
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("Game", GameSchema);
export default Game;
