const forgotPassword = require('./../templates/forgotPassword')
const ErrorHandler = require('./../utilities/errorHandler')
const emailHelper = require('./../utilities/emailHelper')
const loginDetail = require('./../templates/loginDetail')
const pool = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var uniqid = require('uniqid'); 


const JWTSECRET = "MRITUNJAYPASWAN"

exports.getSuperAdmin = async()=>{
  try {
    let user = await pool.query('SELECT * FROM users WHERE role = ?', ['super-admin']);
    if(user.length == 0 ){
      console.log('Super admin not found')
    }else{
      return user[0]
    }
    
  } catch (error) {
    return next(error)
  }
}


exports.addSuperAdmin = async (req, res, next) => {
  
  try {
    const { name, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name , email, hashedPassword, 'super-admin']
    );
    if(result && result.insertId){
      const user = { id: result.insertId, name: name ,email: email, role: 'super-admin'}
      res.status(201).json({
        success: true,
        data: user
      });
    }else{
      return next(new ErrorHandler('Failed to created user'))

    }
  } catch (error) {
    return next(error)
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    if (result && result.insertId) {
      const user = {
        name: name,
        email: email,
        password: password
      };

      const mailObj = {
        to: email,
        subject: `Welcome to Book Store`,
        html: loginDetail.userDetailTemplate(user)
      };

      await emailHelper.sendEmail(mailObj);

      return res.status(201).json({
        success: true,
        data: { id: result.insertId, name, email, role }
      });
    } else {
      return next(new ErrorHandler('Failed to create user'));
    }
  } catch (error) {
    return next(error);
  }
};


exports.login = async (req, res, next) => {
  try {
    const {email, password} = req.body
    let user = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if(user && user.length){
      user = user[0]
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(new ErrorHandler('Invalid email or password', 401));
      }
      const tokenPayload = {
        id: user.id,
        email: user.email
      }
      const token = jwt.sign(tokenPayload, JWTSECRET)
      res.status(200).json({
        success: true,
        data: user,
        token: token
      })
    }else{
      return next(new ErrorHandler('Invalid email or password', 401));
    }
    
  } catch (error) {
    return next(error)
  }
};


exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    let user = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (user && user.length > 0) {
      user = user[0];
      const token = uniqid();
      
      const result = await pool.query(
        'UPDATE users SET forgotPasswordToken = ? WHERE id = ?',
        [token, user.id]
      );
      
      if (result && result.affectedRows > 0) {
        const link = `http://localhost:8080/auth/forgot-password?token=${token}`; // Change later with actual frontend URL
        const mailObj = {
          to: user.email,
          subject: `Forgot Password email.`,
          html: forgotPassword.forgotPassword(user.name, link),  
        };

        await emailHelper.sendEmail(mailObj);
        
        return res.status(200).json({
          success: true,
          message: "Forgot password email sent successfully."
        });
      } else {
        return next(new ErrorHandler('Something went wrong while saving token'));
      }
    } else {
      return next(new ErrorHandler('User not found', 404));
    }
  } catch (error) {
    return next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password, confirmPassword } = req.body;
    
    if (!token) {
      return res.status(400).json({
        status: "Failed",
        message: "No token provided."
      });
    }

    const [userRows] = await pool.query('SELECT * FROM users WHERE forgotPasswordToken = ?', [token]);

    if (!userRows || userRows.length === 0) {
      return res.status(404).json({
        status: "Failed",
        message: "No user found with the provided token."
      });
    }
    const user = userRows;

    if (!password || !confirmPassword || password !== confirmPassword) {
      return res.status(400).json({
        status: "Failed",
        message: "Password and confirm password do not match."
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('UPDATE users SET password = ?, forgotPasswordToken = NULL WHERE id = ?', [hashedPassword, user.id]);

    return res.json({
      status: "Success",
      message: "Your password was changed successfully."
    });
  } catch (error) {
    return next(error);
  }
};


