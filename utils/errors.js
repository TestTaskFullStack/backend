import { ERROR_MESSAGES, ERROR_CODES } from '../config/constants.js';

export class AppError extends Error {
  constructor(message, statusCode = ERROR_CODES.INTERNAL_ERROR, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export const socketCatchAsync = (socket, eventName) => (fn) => {
  return async (...args) => {
    try {
      await fn(...args);
    } catch (error) {
      console.error(`Error in ${eventName}:`, error);
      socket.emit(eventName, {
        success: false,
        error: error.message
      });
    }
  };
};

export const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(e => e.message);
  return new AppError(errors.join(', '), ERROR_CODES.VALIDATION_ERROR);
};

export const handleCastError = () => {
  return new AppError(ERROR_MESSAGES.INVALID_ID, ERROR_CODES.BAD_REQUEST);
};

export const handleDuplicateKeyError = () => {
  return new AppError(ERROR_MESSAGES.DUPLICATE_KEY, ERROR_CODES.CONFLICT);
};