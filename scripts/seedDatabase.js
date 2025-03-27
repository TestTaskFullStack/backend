import { gamesToSeed } from "../config/games.config.js";
import db from "../models/index.js";

const Game = db.Game;

const seedGames = async () => {
  console.log(`Checking/Seeding ${gamesToSeed.length} game(s)...`);
  try {
    for (const gameData of gamesToSeed) {
      const { _id, ...seedData } = gameData;
      const existingGame = await Game.findOne({
        systemGameName: seedData.systemGameName,
      });
      if (!existingGame) {
        await new Game(seedData).save();
        console.log(
          `Added game '${seedData.commonGameName}' (system: ${seedData.systemGameName}).`
        );
        addedGamesCount++;
      } else {
        console.log(
          `Game '${seedData.commonGameName}' (system: ${seedData.systemGameName}) already exists.`
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
};
export default seedGames;
