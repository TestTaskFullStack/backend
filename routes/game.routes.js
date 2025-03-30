import express from "express";
import { authJwt } from "../middlewares/index.js";
import {
    getAllGames,
    getGameById,
} from "../controllers/game.controller.js";

const router = express.Router();

router.get("/", getAllGames);
router.get("/:id", getGameById);


export default router; 