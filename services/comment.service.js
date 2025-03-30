import db from '../models/index.js';
import { AppError } from '../utils/errors.js';
import { ERROR_MESSAGES } from '../config/constants.js';
import mongoose from 'mongoose';

const Comment = db.Comment;
const Game = db.Game;

export const commentService = {
    async create({ text, authorId, gameId }) {
        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            throw new AppError(ERROR_MESSAGES.INVALID_ID, 400);
        }

        const comment = new Comment({
            text,
            author: authorId
        });

        await comment.save();

        const game = await Game.findByIdAndUpdate(
            gameId,
            { $push: { comments: comment._id } },
            { new: true }
        )
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
                select: 'username'
            }
        });

        if (!game) {
            await Comment.findByIdAndDelete(comment._id);
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
        }

        return { game, comment };
    },

    async findByGameId(gameId) {
        if (!mongoose.Types.ObjectId.isValid(gameId)) {
            throw new AppError(ERROR_MESSAGES.INVALID_ID, 400);
        }

        const comments = await Comment.find({ game: gameId })
            .populate({
                path: 'author',
                select: 'username'
            })
            .sort({ createdAt: -1 });

        return comments;
    },

    async delete(commentId, userId) {
        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            throw new AppError(ERROR_MESSAGES.INVALID_ID, 400);
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw new AppError(ERROR_MESSAGES.NOT_FOUND, 404);
        }

        if (comment.author.toString() !== userId.toString()) {
            throw new AppError(ERROR_MESSAGES.FORBIDDEN, 403);
        }

        await Game.updateOne(
            { comments: commentId },
            { $pull: { comments: commentId } }
        );

        await Comment.findByIdAndDelete(commentId);

        return comment;
    }
}; 