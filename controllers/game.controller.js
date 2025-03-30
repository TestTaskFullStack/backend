import { gameService } from '../services/game.service.js';
import { catchAsync } from '../utils/errors.js';

export const getAllGames = catchAsync(async (req, res) => {
    const result = await gameService.getAllGames(req.query);
    res.json({
        success: true,
        ...result
    });
});

export const getGameById = catchAsync(async (req, res) => {
    const game = await gameService.getGameById(req.params.id);
    res.json({
        success: true,
        data: game
    });
});

