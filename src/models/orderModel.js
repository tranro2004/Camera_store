const db = require('../utils/connectDB');

// Tạo một đơn hàng mới trong bảng orders
const createOrder = async (userId, totalPrice, paymentMethod) => {
  const query = 'INSERT INTO orders (user_id, total_price, payment_method, status) VALUES (?, ?, ?, ?)';
  const [result] = await db.execute(query, [userId, totalPrice, paymentMethod, 'processing']);
  return result.insertId;  // Trả về ID của đơn hàng
};

// Thêm một sản phẩm vào bảng order_items
const addOrderItem = async (orderId, productId, quantity, price) => {
  const total = price * quantity;  // Tính tổng tiền của món hàng (số lượng * giá)
  const query = 'INSERT INTO order_items (order_id, product_id, quantity, price, total) VALUES (?, ?, ?, ?, ?)';
  const [result] = await db.execute(query, [orderId, productId, quantity, price, total]); // Lưu vào database
  return result.insertId;  // Trả về ID của món hàng trong đơn hàng
};

// Lấy các món trong đơn hàng theo orderId
const getOrderItemsByOrderId = async (orderId) => {
  const query = 'SELECT oi.product_id, p.name, oi.quantity, oi.price, oi.total ' +
                'FROM order_items oi ' +
                'JOIN products p ON oi.product_id = p.product_id ' +
                'WHERE oi.order_id = ?';
  const [rows] = await db.execute(query, [orderId]);
  return rows;  // Trả về danh sách các sản phẩm trong đơn hàng
};

// Lấy lịch sử đơn hàng của người dùng
const getOrderHistoryByUserId = async (userId) => {
  const query = 'SELECT o.order_id, o.total_price, o.payment_method, o.status, o.created_at ' +
                'FROM orders o ' +
                'WHERE o.user_id = ? ' +
                'ORDER BY o.created_at DESC';
  const [rows] = await db.execute(query, [userId]);
  return rows;  // Trả về danh sách các đơn hàng của người dùng
};

const getOrderById = async (orderId, userId = null) => {
  let query = `
      SELECT o.order_id, o.total_price, o.payment_method, o.status, o.created_at, u.name AS customer_name
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      WHERE o.order_id = ?
  `;
  const params = [orderId];

  if (userId) {
      query += ' AND o.user_id = ?';
      params.push(userId);
  }

  const [rows] = await db.execute(query, params);
  return rows.length > 0 ? rows[0] : null;
};

// Get all orders
const getAllOrders = async () => {
  const query = `
      SELECT o.order_id, o.total_price, o.payment_method, o.status, o.created_at, u.name AS customer_name
      FROM orders o
      JOIN users u ON o.user_id = u.user_id
      ORDER BY o.created_at DESC
  `;
  const [rows] = await db.execute(query);
  return rows;
};

// Update order status
const updateOrderStatus = async (orderId, status) => {
  const query = 'UPDATE orders SET status = ? WHERE order_id = ?';
  const [result] = await db.execute(query, [status, orderId]);
  return result.affectedRows > 0;
};

module.exports = { createOrder, addOrderItem, getOrderItemsByOrderId, getOrderHistoryByUserId, getOrderById, getAllOrders, updateOrderStatus };
