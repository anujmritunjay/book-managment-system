const { addUser, addSuperAdmin, login, forgotPassword, resetPassword } = require('../controllers/userController');
const roleMiddleware = require('./../middleware/roleMiddleware')
const auth = require('./../middleware/authMiddleware')
const express = require('express');
const router = express.Router();

router.post('/add-user',auth, roleMiddleware.superAdmin, addUser);
router.post('/create-super-admin', addSuperAdmin);
router.post('/log-in', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;