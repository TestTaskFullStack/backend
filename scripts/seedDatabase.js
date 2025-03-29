import { gamesToSeed } from "./mockData/games.js";
import { genresToSeed } from "./mockData/genre.js";
import db from "../models/index.js";

const Genre = db.Genre;
const Game = db.Game;

const seedGenres = async () => {
  for (const genreName of genresToSeed) {
    const existingGame = await Genre.findOne({
      name: genreName,
    });
    if (existingGame) {
      console.log(`Genre '${genreName}' already exists.`);
    } else {
      await new Genre({ name: genreName }).save();
      console.log(`Added genre '${genreName}'.`);
    }
  }
};

const seedGames = async () => {
  for (const gameData of gamesToSeed) {
    const { _id, ...seedData } = gameData;

    const existingGame = await Game.findOne({
      systemGameName: seedData.systemGameName,
    });
    if (!existingGame) {
      let data = seedData;
      let genre = await Genre.findOne({ name: seedData.genre });
      data.genre = genre._id;
      await new Game(data).save();

      console.log(
        `Added game '${seedData.commonGameName}' (system: ${seedData.systemGameName}).`
      );
    } else {
      console.log(
        `Game '${seedData.commonGameName}' (system: ${seedData.systemGameName}) already exists.`
      );
    }
  }
};

const seedData = async () => {
  console.log(`Checking/Seeding ${gamesToSeed.length} game(s)...`);
  try {
    await seedGenres();
    await seedGames();
  } catch (err) {
    console.error(err);
  }
};
export default seedData;
