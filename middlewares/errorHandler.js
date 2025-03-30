import { logError } from '../utils/logger.js';
import { AppError, handleValidationError, handleCastError, handleDuplicateKeyError } from '../utils/errors.js';
import { ERROR_CODES, ERROR_MESSAGES } from '../config/constants.js';

export const errorHandler = (err, req, res, next) => {
    logError(err, req);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
            status: err.status
        });
    }

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        const error = handleValidationError(err);
        return res.status(error.statusCode).json({
            success: false,
            error: error.message,
            status: error.status
        });
    }

    // Handle Mongoose cast errors (invalid ID format)
    if (err.name === 'CastError') {
        const error = handleCastError();
        return res.status(error.statusCode).json({
            success: false,
            error: error.message,
            status: error.status
        });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
        const error = handleDuplicateKeyError();
        return res.status(error.statusCode).json({
            success: false,
            error: error.message,
            status: error.status
        });
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(ERROR_CODES.UNAUTHORIZED).json({
            success: false,
            error: ERROR_MESSAGES.INVALID_TOKEN,
            status: 'fail'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(ERROR_CODES.UNAUTHORIZED).json({
            success: false,
            error: ERROR_MESSAGES.TOKEN_EXPIRED,
            status: 'fail'
        });
    }

    // Handle unknown errors
    const error = new AppError(
        process.env.NODE_ENV === 'production' 
            ? ERROR_MESSAGES.INTERNAL_ERROR 
            : err.message,
        ERROR_CODES.INTERNAL_ERROR,
        false
    );

    res.status(error.statusCode).json({
        success: false,
        error: error.message,
        status: error.status
    });
}; 