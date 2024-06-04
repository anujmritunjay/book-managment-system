const ErrorHandler = require('./../utilities/errorHandler')
const superAdmin = (req, res, next) => {
    try {
        if (req.user) {
            const user = req.user;
            const role = user.role;
            if (role === 'super-admin') {
                return next();
            }
            return next(new ErrorHandler('You are not a super admin', 401));
        } else {
            return next(new ErrorHandler('User not authenticated', 401));
        }
    } catch (error) {
        return next(error);
    }
};

const admin = (req, res, next) => {
    try {
        if (req.user) {
            const user = req.user;
            const role = user.role;
            if (role === 'admin') {
                return next();
            }
            return next(new ErrorHandler('You are not a admin', 401));
        } else {
            return next(new ErrorHandler('User not authenticated', 401));
        }
    } catch (error) {
        return next(error);
    }
};


const user = (req, res, next) => {
    try {
        if (req.user) {
            const user = req.user;
            const role = user.role;
            if (role === 'user') {
                return next();
            }
            return next(new ErrorHandler('You are not a user', 401));
        } else {
            return next(new ErrorHandler('User not authenticated', 401));
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = { superAdmin, admin, user };

