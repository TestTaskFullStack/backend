import db from '../models/index.js';
import { AppError } from '../utils/errors.js';
import { ERROR_MESSAGES } from '../config/constants.js';
import mongoose from 'mongoose';

const User = db.User;
const Game = db.Game;

export const userService = {
    async startGame(userId, gameId) {
        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            throw new AppError(ERROR_MESSAGES.INVALID_ID, 400);
        }

        const game = await Game.findById(gameId);
        if (!game) {
            throw new AppError(ERROR_MESSAGES.GAME_NOT_FOUND, 404);
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { startedGames: gameId } },
            { new: true }
        ).populate('startedGames');

        if (!user) {
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
        }

        return { user, game };
    },

    async getStartedGames(userId) {
        const user = await User.findById(userId)
            .populate({
                path: 'startedGames',
                populate: {
                    path: 'genre',
                    select: 'name'
                }
            });

        if (!user) {
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
        }

        return user.startedGames;
    },

    async getAchievements(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
        }

        return user.achievements || [];
    },

    async addAchievement(userId, achievement) {
        const user = await User.findByIdAndUpdate(
            userId,
            { 
                $addToSet: { 
                    achievements: achievement 
                } 
            },
            { new: true }
        );

        if (!user) {
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
        }

        return user.achievements;
    }
}; 