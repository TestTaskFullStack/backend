import { gamesToSeed } from "./mockData/games.js";
import { genresToSeed } from "./mockData/genre.js";
import db from "../models/index.js";

const Genre = db.Genre;
const Game = db.Game;
const User = db.User;



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


const seedUser = async () => {
  const existingUser = await User.findOne({
    username: 'admin',
  });
  if (existingUser) {
    console.log(`User 'admin' already exists.`);
  } else {
    const user = new User({
      username: 'admin',
      email: 'admin@admin.com',
      password: '$2b$08$tUca47vS5K20EvknmZjKJ.4k9xdulCTV9bgTRYbRo/OdV1sI4vzAW',
    });
    await user.save();
    console.log(`Added user '${user.username}'.`);
  }
};


const seedData = async () => {
  console.log(`Checking/Seeding ${gamesToSeed.length} game(s)...`);
  try {
    await seedGenres();
    await seedGames();
    await seedUser();
  } catch (err) {
    console.error(err);
  }
};
export default seedData;
