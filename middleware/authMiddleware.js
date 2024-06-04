const ErrorHandler = require('./../utilities/errorHandler')
const pool = require('../config/database');
const jwt = require('jsonwebtoken');

const JWTSECRET = "MRITUNJAYPASWAN"


const authMiddleware = async(req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return next(new ErrorHandler('Access denied, no token provided', 401));
  }

  try {
    const decoded = jwt.verify(token, JWTSECRET);
    const users = await pool.query('SELECT * FROM users WHERE email = ? AND id = ?', [decoded.email, decoded.id]);
    if(users && users.length){
      const user = users[0]
      req.user = user
    }else{
      return next(new ErrorHandler('Unauthorized', 401));
    }
    next();
  } catch (error) {
    return next(error)
  }
};

module.exports = authMiddleware;
