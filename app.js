import express from "express";
import cors from "cors";
import http from "http";
import db from "./models/index.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import gameRoutes from "./routes/game.routes.js";
import genreRoutes from "./routes/genre.routes.js";
import initializeSocket from "./sockets/index.js";
import setupSwagger from "./config/swagger.js";

import seedData from "./scripts/seedDatabase.js";

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Node.js JWT Authentication application.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 8080;

db.mongoose
  .connect(`mongodb://${db.config.HOST}:${db.config.PORT}/${db.config.DB}`)
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    initial();
    
    console.log("Initializing Socket.io server...");
    initializeSocket(server);
    console.log("Socket.io server initialized");
    
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
      console.log(`Socket.io server is running.`);
      console.log(`Socket.io test page available at http://localhost:${PORT}/socket-test`);
    });
  })
  .catch((err) => {
    console.error("Connection error:", err);
    process.exit();
  });

 function initial() {
  db.Role.estimatedDocumentCount()
    .then((count) => {
      if (count === 0) {
        return Promise.all([
          new db.Role({ name: "user" }).save(),
          new db.Role({ name: "admin" }).save(),
        ]);
      }
    })
    .then((roles) => {
      if (roles) {
        console.log("Added 'user', 'admin' to roles collection.");
      }
    })
    .catch((err) => {
      console.error("Error initializing roles:", err);
    });
    seedData()
}
