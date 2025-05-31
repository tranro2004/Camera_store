const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const authMiddleware = require('../middleware/authMiddleware');
const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');

// Route hiển thị trang thanh toán
router.get('/checkout', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { cartId } = req.query; // Lấy cartId từ query string
        console.log('User ID:', userId);
        console.log('Cart ID from query:', cartId);

        let cart;
        if (cartId) {
            cart = await cartModel.getCartById(cartId);
            console.log('Cart from cartId:', cart);
            if (!cart || cart.user_id !== userId) {
                console.log('Invalid cart or unauthorized access');
                return res.status(403).json({ message: 'Giỏ hàng không hợp lệ hoặc bạn không có quyền truy cập' });
            }
        } else {
            cart = await cartModel.getCart(userId);
            console.log('Cart from userId:', cart);
            if (!cart) {
                console.log('Cart not found for user:', userId);
                return res.render('checkout', { cartItems: [], total: 0, user: req.user, cartId: null });
            }
        }

        const items = await cartModel.getCartItems(cart.cart_id);
        console.log('Cart Items:', items);

        if (!items || items.length === 0) {
            console.log('No items found in cart:', cart.cart_id);
            return res.render('checkout', { cartItems: [], total: 0, user: req.user, cartId: cart.cart_id });
        }

        const enrichedItems = await Promise.all(
            items.map(async (item) => {
                const product = await productModel.getProductById(item.product_id);
                console.log('Product for item:', item.product_id, product);
                return {
                    productName: product.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity,
                };
            })
        );

        const total = enrichedItems.reduce((sum, item) => sum + item.total, 0);
        console.log('Enriched Items:', enrichedItems);
        console.log('Total:', total);

        res.render('checkout', { cartItems: enrichedItems, total, user: req.user, cartId: cart.cart_id });
    } catch (error) {
        console.error('Error rendering checkout:', error);
        res.render('checkout', { cartItems: [], total: 0, user: req.user, cartId: null });
    }
});

// Route xử lý thanh toán
router.post('/checkout', authMiddleware, checkoutController.checkout);

// Route hiển thị lịch sử đơn hàng
router.get('/order-history', authMiddleware, checkoutController.getOrderHistory);

// Route hiển thị chi tiết đơn hàng
router .get('/order-history/:orderId', authMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.userId;

        // Fetch the order details
        const order = await orderModel.getOrderById(orderId, userId);
        if (!order) {
            return res.status(404).render('order-detail', { order: null, items: [] });
        }

        // Fetch the items in the order
        const items = await orderModel.getOrderItemsByOrderId(orderId);
        if (!items || items.length === 0) {
            return res.status(404).render('order-detail', { order, items: [] });
        }

        res.render('order-detail', { order, items });
    } catch (error) {
        console.error('Error rendering order detail:', error);
        res.render('order-detail', { order: null, items: [] });
    }
});

module.exports = router;