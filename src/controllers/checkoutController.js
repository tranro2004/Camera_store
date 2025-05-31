const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');

// API thanh toán
const checkout = async (req, res) => {
  try {
    const { cartId, paymentMethod, name, email, address } = req.body;
    const userId = req.user.userId;

    // Validate payment method
    if (!paymentMethod || !['credit_card', 'cash_on_delivery'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Phương thức thanh toán không hợp lệ' });
    }

    // Validate other fields
    if (!name || !email || !address) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin thanh toán' });
    }

    const cartItems = await cartModel.getCartItems(cartId);
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng rỗng' });
    }

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const orderId = await orderModel.createOrder(userId, totalPrice, paymentMethod);

    for (const item of cartItems) {
      await orderModel.addOrderItem(orderId, item.product_id, item.quantity, item.price);
    }

    await cartModel.removeCart(cartId);

    // Redirect to the home page after successful checkout
    res.redirect('/');
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ message: 'Có lỗi khi thanh toán', error });
  }
};

// Hiển thị lịch sử đơn hàng của người dùng
const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await orderModel.getOrderHistoryByUserId(userId);

    // Render the order-history.pug template with the fetched orders
    res.render('order-history', { orders, user: req.user });
  } catch (error) {
    console.error('Error fetching order history:', error);
    res.render('order-history', { orders: [], user: req.user }); // Render with an empty array if there's an error
  }
};

const getAllOrders = async (req, res) => {
        try {
            const orders = await orderModel.getAllOrders();
            res.render('admin/order/orders', { orders, user: req.user });
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).send('Error fetching orders');
        }
    }

// Get order details
const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.getOrderById(orderId);
        const items = await orderModel.getOrderItemsByOrderId(orderId);

        if (!order) {
            return res.status(404).send('Order not found');
        }

        res.render('admin/order/order-detail', { order, items, user: req.user });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).send('Error fetching order details');
    }
}

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
      const { orderId } = req.params;
      const { status } = req.body;

      const success = await orderModel.updateOrderStatus(orderId, status);
      if (!success) {
          return res.status(400).send('Failed to update order status');
      }

      res.redirect('/admin/orders');
  } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).send('Error updating order status');
  }
};



module.exports = { checkout, getOrderHistory, getAllOrders, getOrderDetails, updateOrderStatus };
