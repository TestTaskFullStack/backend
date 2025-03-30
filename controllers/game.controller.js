
import db from '../models/index.js';
import { gameService } from '../services/game.service.js';
import { catchAsync } from '../utils/errors.js';

const User = db.User;

export const getAllGames = catchAsync(async (req, res) => {
    const result = await gameService.getAllGames(req.query);
    res.json({
        success: true,
        ...result
    });
});

export const getGameById = catchAsync(async (req, res) => {

    let dataGame = await gameService.getGameById(req.params.id)
    
    res.json({
        success: true,
        data: dataGame
    });
});

