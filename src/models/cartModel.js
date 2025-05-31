const db = require('../utils/connectDB');

// Lấy thông tin sản phẩm theo productId
const getProductById = async (productId) => {
    const query = 'SELECT * FROM products WHERE product_id = ?';
    const [rows] = await db.execute(query, [productId]);
    return rows[0]; // Trả về thông tin sản phẩm
};
  

const createCart = async (userId) => {
  if (!userId) {
      throw new Error("userId không hợp lệ");
  }

  const query = 'INSERT INTO cart (user_id, created_at) VALUES (?, NOW())';
  const [result] = await db.execute(query, [userId]);
  return result.insertId;  // Trả về ID của giỏ hàng đã tạo
};

// Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
const getCartItemByProductId = async (cartId, productId) => {
  const query = 'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?';
  const [rows] = await db.execute(query, [cartId, productId]);
  return rows[0];
};

// Thêm sản phẩm vào giỏ hàng (nếu trùng thì tăng quantity)
const addCartItem = async (cartId, productId, quantity, price) => {
  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const existingItem = await getCartItemByProductId(cartId, productId);
  if (existingItem) {
    // Nếu đã có, tăng quantity
    const newQuantity = existingItem.quantity + quantity;
    const query = 'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?';
    await db.execute(query, [newQuantity, existingItem.cart_item_id]);
    return existingItem.cart_item_id;
  } else {
    // Nếu chưa có, thêm mới
    const query = 'INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(query, [cartId, productId, quantity, price]);
    return result.insertId;
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItemQuantity = async (cartItemId, quantity) => {
  const query = 'UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?';
  await db.execute(query, [quantity, cartItemId]);
};

// Get all items from a specific cart
// Lấy thông tin món hàng trong giỏ hàng theo cart_item_id
const getCartItemById = async (cartItemId) => {
  const query = 'SELECT * FROM cart_items WHERE cart_item_id = ?';
  const [rows] = await db.execute(query, [cartItemId]);
  return rows[0];  // Trả về món hàng nếu tồn tại
};


// Lấy giỏ hàng theo cartId
const getCartById = async (cartId) => {
    const query = 'SELECT * FROM cart WHERE cart_id = ?';
    const [rows] = await db.execute(query, [cartId]);
    return rows[0];  // Trả về giỏ hàng nếu tồn tại
};


// Xóa sản phẩm khỏi giỏ hàng
const removeCartItem = async (cartItemId) => {
  const query = 'DELETE FROM cart_items WHERE cart_item_id = ?';
  try {
      const [result] = await db.execute(query, [cartItemId]);
      console.log("Database delete result:", result);  // Log kết quả xóa từ DB
      return result.affectedRows > 0;  // Nếu xóa thành công, trả về true
  } catch (error) {
      console.error("Error executing delete query:", error);  // Log lỗi khi thực thi truy vấn
      return false;
  }
};
// Lấy tất cả các sản phẩm trong giỏ hàng theo cartId
const getCartItems = async (cartId) => {
  const query = 'SELECT * FROM cart_items WHERE cart_id = ?';
  const [rows] = await db.execute(query, [cartId]);
  return rows;  // Trả về danh sách các sản phẩm trong giỏ hàng
};

// Xóa tất cả các món trong giỏ hàng
const removeCartItems = async (cartId) => {
  const query = 'DELETE FROM cart_items WHERE cart_id = ?';
  await db.execute(query, [cartId]);
};

// Xóa giỏ hàng
const removeCart = async (cartId) => {
  try {
    // Xóa các món hàng trong giỏ hàng trước khi xóa giỏ hàng
    await removeCartItems(cartId);

    // Sau đó xóa giỏ hàng
    const query = 'DELETE FROM cart WHERE cart_id = ?';
    const [result] = await db.execute(query, [cartId]);

    return result.affectedRows > 0;  // Trả về true nếu xóa thành công
  } catch (error) {
    console.error('Error executing delete query:', error);  // Log lỗi khi thực thi truy vấn
    return false;
  }
};

// Lấy giỏ hàng theo userId
const getCart = async (userId) => {
  const query = 'SELECT * FROM cart WHERE user_id = ? LIMIT 1';
  const [rows] = await db.execute(query, [userId]);
  return rows[0];
};

// Cập nhật số lượng tồn kho của sản phẩm
const updateProductQuantity = async (productId, quantityChange) => {
  const query = 'UPDATE products SET quantity = quantity + ? WHERE product_id = ?';
  await db.execute(query, [quantityChange, productId]);
};

// Lấy số lượng tồn kho của sản phẩm
const getProductQuantity = async (productId) => {
  const query = 'SELECT quantity FROM products WHERE product_id = ?';
  const [rows] = await db.execute(query, [productId]);
  return rows[0]?.quantity || 0;
};


module.exports = { createCart, addCartItem, getCartItemById, getCartById, getProductById, removeCartItem, getCartItems, removeCart, getCart,
  getCartItemByProductId, updateCartItemQuantity, updateProductQuantity, getProductQuantity
 };
