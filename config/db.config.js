import  'dotenv/config'


export default {
  HOST: process.env.HOST,
  PORT: process.env.MONGO_DB_PORT,
  DB: process.env.MONGO_DB_NAME,
  USER: process.env.MONGO_DB_USER,
  PASSWORD: process.env.MONGO_DB_PASSWORD,
};
