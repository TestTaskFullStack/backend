import { gamesToSeed } from "./mockData/games.js";
import { genresToSeed } from "./mockData/genre.js";
import db from "../models/index.js";
import { achievementsToSeed } from "./mockData/achievementsToSeed.js";

const Genre = db.Genre;
const Game = db.Game;
const Achievement = db.Achievement;


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
      data.comments = [];
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

const seedAchievements = async () => {
  for (const achievementData of achievementsToSeed) {
    const { _id, ...seedData } = achievementData;
    const existingAchievement = await Achievement.findOne({
      title: seedData.title,
    });
    if (!existingAchievement) {
      await new Achievement(seedData).save();
      console.log(`Added achievement '${seedData.title}'.`);

    } else {
      console.log(`Achievement '${seedData.title}' already exists.`);
    }
  }
};

const seedData = async () => {
  console.log(`Checking/Seeding ${gamesToSeed.length} game(s)...`);
  try {
    await seedAchievements();
    await seedGenres();
    await seedGames();
  } catch (err) {
    console.error(err);
  }
};
export default seedData;
