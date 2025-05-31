const cartModel = require('../models/cartModel');
const productModel = require('../models/productModel');


// Tạo giỏ hàng mới cho người dùng đã đăng nhập
const createCart = async (req, res) => {
  try {
      const userId = req.user.userId;  // Thay đổi từ req.user.id thành req.user.userId
      console.log("userId in createCart:", userId);  // Log userId để kiểm tra

      if (!userId) {
          return res.status(400).json({ message: 'userId không hợp lệ' });
      }
      // Kiểm tra xem người dùng đã có giỏ hàng chưa
    let cart = await cartModel.getCart(userId);
    if (cart) {
      return res.status(200).json({ cartId: cart.cart_id }); // Trả về cartId hiện có
    }
      const cartId = await cartModel.createCart(userId);  // Tạo giỏ hàng mới
      res.status(201).json({ cartId });
  } catch (error) {
      console.error('Error creating cart:', error);
      res.status(500).json({ message: 'Error creating cart', error });
  }
};




// Thêm món vào giỏ hàng
const addCartItem = async (req, res) => {
  try {
    const { cartId, productId, quantity } = req.body;
    const userId = req.user.userId;

    // Kiểm tra xem giỏ hàng có thuộc về người dùng không
    const cart = await cartModel.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
    }

    if (cart.user_id !== userId) {
      return res.status(403).json({ message: "Bạn không có quyền sửa giỏ hàng này" });
    }

    // Lấy thông tin sản phẩm
    const product = await productModel.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    // Kiểm tra số lượng tồn kho
    const currentStock = await cartModel.getProductQuantity(productId);
    const existingItem = await cartModel.getCartItemByProductId(cartId, productId);
    const currentQuantityInCart = existingItem ? existingItem.quantity : 0;
    const totalQuantityRequested = currentQuantityInCart + parseInt(quantity);

    if (currentStock < totalQuantityRequested) {
      return res.status(400).json({ message: 'Số lượng tồn kho không đủ' });
    }

    // Thêm sản phẩm vào giỏ hàng (tăng quantity nếu trùng)
    const cartItemId = await cartModel.addCartItem(cartId, productId, parseInt(quantity), product.price);

    // Trừ số lượng tồn kho
    await cartModel.updateProductQuantity(productId, -parseInt(quantity));

    // Lấy thông tin sản phẩm sau khi thêm (để lấy quantity cập nhật)
    const updatedItem = await cartModel.getCartItemById(cartItemId);

    // Trả về thông tin sản phẩm đã thêm vào giỏ hàng
    res.status(201).json({
      message: 'Sản phẩm đã được thêm vào giỏ hàng',
      cartItem: {
        cartItemId,
        productId: product.product_id,
        productName: product.name,
        price: product.price,
        quantity: updatedItem.quantity, // Số lượng sau khi cập nhật
        total: product.price * updatedItem.quantity,
      },
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Lỗi khi thêm sản phẩm vào giỏ hàng', error: error.message });
  }
};

// Lấy các món trong giỏ hàng của người dùng
const getCartItems = async (req, res) => {
  try {
      const cartId = req.params.cartId;
      const userId = req.user.userId; // Sửa từ req.user.id thành req.user.userId

      // Kiểm tra xem giỏ hàng có thuộc về người dùng không
      const cart = await cartModel.getCartById(cartId);
      if (!cart) {
          return res.status(404).json({ message: "Giỏ hàng không tồn tại" });
      }

      if (cart.user_id !== userId) {
          return res.status(403).json({ message: 'Bạn không có quyền xem giỏ hàng này' });
      }

      const items = await cartModel.getCartItems(cartId);
      const enrichedItems = await Promise.all(
          items.map(async (item) => {
              const product = await productModel.getProductById(item.product_id);
              return {
                  cartItemId: item.cart_item_id,
                  productId: item.product_id,
                  productName: product.name,
                  price: item.price,
                  quantity: item.quantity,
                  total: item.price * item.quantity,
              };
          })
      );

      res.status(200).json({ cartItems: enrichedItems });
  } catch (error) {
      console.error('Error fetching cart items:', error);
      res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm trong giỏ hàng', error: error.message });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
const removeCartItem = async (req, res) => {
  try {
      const { cartItemId } = req.body;
      const userId = req.user.userId;  // Lấy userId từ thông tin người dùng đã xác thực

      console.log("Request to remove item:", cartItemId, userId);  // Log dữ liệu

      // Kiểm tra xem món hàng có tồn tại trong giỏ hàng của người dùng không
      const cartItem = await cartModel.getCartItemById(cartItemId);
      if (!cartItem) {
          console.error("Cart item not found:", cartItemId);  // Log nếu không tìm thấy món hàng
          return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
      }

      // Kiểm tra xem giỏ hàng có thuộc về người dùng không
      const cart = await cartModel.getCartById(cartItem.cart_id);
      if (cart.user_id !== userId) {
          console.error("Unauthorized access: User doesn't own the cart", cart.user_id, userId);
          return res.status(403).json({ message: "Bạn không có quyền xóa sản phẩm này" });
      }

      // Xóa sản phẩm khỏi giỏ hàng
      const result = await cartModel.removeCartItem(cartItemId);
      if (result) {
          console.log("Product successfully removed from cart");
          res.status(200).json({ message: "Sản phẩm đã được xóa khỏi giỏ hàng" });
      } else {
          console.error("Failed to remove product from cart");
          res.status(500).json({ message: "Lỗi khi xóa sản phẩm khỏi giỏ hàng" });
      }
  } catch (error) {
      console.error("Error when removing product from cart:", error);  // Log chi tiết lỗi
      res.status(500).json({ message: "Lỗi khi xóa sản phẩm khỏi giỏ hàng", error });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
const updateCartItemQuantity = async (req, res) => {
    try {
      const { cartItemId, quantity } = req.body;
      const userId = req.user.userId;
  
      const cartItem = await cartModel.getCartItemById(cartItemId);
      if (!cartItem) {
        return res.status(404).json({ message: "Sản phẩm không tồn tại trong giỏ hàng" });
      }
  
      const cart = await cartModel.getCartById(cartItem.cart_id);
      if (cart.user_id !== userId) {
        return res.status(403).json({ message: "Bạn không có quyền sửa giỏ hàng này" });
      }
  
      // Kiểm tra số lượng tồn kho
      const currentStock = await cartModel.getProductQuantity(cartItem.product_id);
      if (quantity > cartItem.quantity && currentStock < (quantity - cartItem.quantity)) {
        return res.status(400).json({ message: 'Số lượng tồn kho không đủ' });
      }
  
      // Cập nhật số lượng tồn kho
      const quantityChange = quantity - cartItem.quantity;
      await cartModel.updateProductQuantity(cartItem.product_id, -quantityChange);
  
      // Cập nhật số lượng trong giỏ hàng
      await cartModel.updateCartItemQuantity(cartItemId, quantity);
  
      res.status(200).json({ message: 'Cập nhật số lượng thành công', newQuantity: quantity });
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      res.status(500).json({ message: 'Lỗi khi cập nhật số lượng', error: error.message });
    }
  };




module.exports = { createCart, addCartItem, getCartItems, removeCartItem, updateCartItemQuantity };
