const orderModel = require('../models/orderModel');

class OrderController {
    // Get all orders
    async getAllOrders(req, res) {
        try {
            const orders = await orderModel.getAllOrders();
            res.render('admin/order/orders', { orders, user: req.user });
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).send('Error fetching orders');
        }
    }

    // Get order details
    async getOrderDetails(req, res) {
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
    async updateOrderStatus(req, res) {
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
    }
}

module.exports = new OrderController();