import db from '../models/index.js';
import { AppError } from '../utils/errors.js';
import { ERROR_MESSAGES, PAGINATION } from '../config/constants.js';
import mongoose from 'mongoose';

const Game = db.Game;
const Genre = db.Genre;
const User = db.User;

export const gameService = {
    async getAllGames(query = {}) {
        const page = parseInt(query.page) || PAGINATION.DEFAULT_PAGE;
        const limit = parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT;
        const skip = (page - 1) * limit;

        const filterQuery = {};

        if (query.genre) {
            if (typeof query.genre === 'string') {
                const genre = await Genre.findOne({ name: query.genre.toUpperCase() });
                if (genre) {
                    filterQuery.genre = genre._id;
                }
            } else {
                filterQuery.genre = query.genre;
            }
        }

        if (query.inTop) {
            filterQuery.inTop = query.inTop === 'true';
        }

        if (query.search) {
            filterQuery.commonGameName = { $regex: query.search, $options: 'i' };
        }

        const [games, total] = await Promise.all([
            Game.find(filterQuery)
                .populate('genre')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Game.countDocuments(filterQuery)
        ]);

        return {
            data: games,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    async getGameById(gameId) {
        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            throw new AppError(ERROR_MESSAGES.INVALID_ID, 400);
        }

        let game = await Game.findById(gameId).populate('genre').populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'username'
            }
        })
        if (!game) {
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
        }

        return game;
    },

    async createGame(gameData) {
        let data = gameData
        data.systemGameName = gameData.commonGameName.toLowerCase().replace(/ /g, '_')
        const game = new Game(data);
        return await game.save();
    },

    async updateGame(gameId, updateData) {
        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            throw new AppError(ERROR_MESSAGES.INVALID_ID, 400);
        }

        const game = await Game.findByIdAndUpdate(
            gameId,
            { $set: updateData },
            { new: true }
        ).populate('genre');

        if (!game) {
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
        }

        return game;
    },

    async deleteGame(gameId) {
        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            throw new AppError(ERROR_MESSAGES.INVALID_ID, 400);
        }

        const game = await Game.findByIdAndDelete(gameId);
        if (!game) {
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
        }

        return game;
    }
};