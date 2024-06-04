const express = require('express');
const auth = require('./../middleware/authMiddleware')
const roleMiddleware = require('./../middleware/roleMiddleware')
const { createOrder } = require('./../controllers/orderController')
const router = express.Router();

router.post('/create-order',auth, roleMiddleware.user, createOrder);

module.exports = router;