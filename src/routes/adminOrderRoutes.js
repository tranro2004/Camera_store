const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/roleMiddleware');
const orderController = require('../controllers/orderController');
const checkoutController = require('../controllers/checkoutController');

// Get all orders
router.get('/', checkAuth, checkAdmin, checkoutController.getAllOrders);

// View order details
router.get('/order-detail/:orderId', checkAuth, checkAdmin, checkoutController.getOrderDetails);

// Update order status
router.post('/update-status/:orderId', checkAuth, checkAdmin, checkoutController.updateOrderStatus);



module.exports = router;