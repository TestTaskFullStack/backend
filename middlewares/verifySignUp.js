import db from '../models/index.js';
import { AppError } from '../utils/errors.js';
import { ERROR_MESSAGES, ERROR_CODES } from '../config/constants.js';

const ROLES = db.ROLES;
const User = db.User;

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try {
        const userByUsername = await User.findOne({ username: req.body.username });
        if (userByUsername) {
            throw new AppError(ERROR_MESSAGES.USER_ALREADY_EXISTS, ERROR_CODES.CONFLICT);
        }

        const userByEmail = await User.findOne({ email: req.body.email });
        if (userByEmail) {
            throw new AppError(ERROR_MESSAGES.USER_ALREADY_EXISTS, ERROR_CODES.CONFLICT);
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

const checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        const invalidRoles = req.body.roles.filter((role) => !ROLES.includes(role));
        if (invalidRoles.length > 0) {
            throw new AppError(
                `Invalid roles: ${invalidRoles.join(', ')}`,
                ERROR_CODES.BAD_REQUEST
            );
        }
    }
    next();
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted,
};

export default verifySignUp;