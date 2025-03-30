import jwt from 'jsonwebtoken';
import config from '../config/auth.config.js';
import db from '../models/index.js';
import { AppError } from '../utils/errors.js';
import { ERROR_MESSAGES, ERROR_CODES } from '../config/constants.js';

const User = db.User;
const Role = db.Role;

const verifyToken = async (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        throw new AppError(ERROR_MESSAGES.NO_TOKEN, ERROR_CODES.FORBIDDEN);
    }

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    try {
        const decoded = jwt.verify(token, config.secret);
        req.userId = decoded.id;

        const user = await User.findById(req.userId);
        if (!user) {
            throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, ERROR_CODES.NOT_FOUND);
        }

        req.user = user;
        next();
    } catch (err) {
        if (err instanceof AppError) {
            next(err);
        } else {
            next(new AppError(ERROR_MESSAGES.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED));
        }
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const user = req.user;
        const roles = await Role.find({ _id: { $in: user.roles } });

        const hasAdminRole = roles.some((role) => role.name === 'admin');

        if (!hasAdminRole) {
            throw new AppError(ERROR_MESSAGES.ADMIN_REQUIRED, ERROR_CODES.FORBIDDEN);
        }

        next();
    } catch (err) {
        if (err instanceof AppError) {
            next(err);
        } else {
            next(new AppError(ERROR_MESSAGES.INTERNAL_ERROR, ERROR_CODES.INTERNAL_ERROR));
        }
    }
};

const authJwt = {
    verifyToken,
    isAdmin,
};

export default authJwt;