import db from '../models/index.js';
import { AppError } from '../utils/errors.js';
import { ERROR_MESSAGES } from '../config/constants.js';
import mongoose from 'mongoose';

const Genre = db.Genre;

export const genreService = {
    async getAllGenres() {
        return await Genre.find().sort({ name: 1 });
    },

    async getGenreById(genreId) {
        if (!mongoose.Types.ObjectId.isValid(genreId)) {
            throw new AppError(ERROR_MESSAGES.INVALID_ID, 400);
        }

        const genre = await Genre.findById(genreId);
        if (!genre) {
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
        }

        return genre;
    },

    async createGenre(genreData) {
        const genre = new Genre(genreData);
        return await genre.save();
    },

    async updateGenre(genreId, updateData) {
        if (!mongoose.Types.ObjectId.isValid(genreId)) {
            throw new AppError(ERROR_MESSAGES.INVALID_ID, 400);
        }

        const genre = await Genre.findByIdAndUpdate(
            genreId,
            { $set: updateData },
            { new: true }
        );

        if (!genre) {
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
        }

        return genre;
    },

    async deleteGenre(genreId) {
        if (!mongoose.Types.ObjectId.isValid(genreId)) {
            throw new AppError(ERROR_MESSAGES.INVALID_ID, 400);
        }

        const genre = await Genre.findByIdAndDelete(genreId);
        if (!genre) {
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
        }

        return genre;
    }
}; 