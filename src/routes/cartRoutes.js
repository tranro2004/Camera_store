const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');
const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');

// Route để render trang giỏ hàng
router.get('/', authMiddleware, async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).send('Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại');
        }

        const userId = req.user.userId;
        let cart = await cartModel.getCart(userId);

        if (!cart) {
            const cartId = await cartModel.createCart(userId);
            cart = await cartModel.getCartById(cartId);
        }

        const items = await cartModel.getCartItems(cart.cart_id);
        const cartCount = items.reduce((total, item) => total + item.quantity, 0);
        const enrichedItems = await Promise.all(
            items.map(async (item) => {
                const product = await productModel.getProductById(item.product_id);
                if (!product) {
                    throw new Error(`Sản phẩm với ID ${item.product_id} không tồn tại`);
                }
                return {
                    cartItemId: item.cart_item_id,
                    productName: product.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity,
                };
            })
        );

        res.render('cart', { cartItems: enrichedItems, cartCount, cartId: cart.cart_id });
    } catch (error) {
        console.error('Error rendering cart:', error);
        res.status(500).send(`Lỗi khi tải trang giỏ hàng: ${error.message}`);
    }
});

// Create a new cart
router.post('/create', authMiddleware, cartController.createCart);

// Add an item to the cart
router.post('/add-item', authMiddleware, cartController.addCartItem);

// Get all items from a cart
router.get('/:cartId/items', authMiddleware, cartController.getCartItems);

// Route để xóa món khỏi giỏ hàng
router.delete('/remove-item', authMiddleware, cartController.removeCartItem);

// Route để cập nhật số lượng
router.put('/update-quantity', authMiddleware, cartController.updateCartItemQuantity);

module.exports = router;