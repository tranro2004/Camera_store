const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Dùng axios để gọi API
const session = require('express-session');
const flash = require('connect-flash');
const userRoutes = require('./src/routes/userRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');  // Thêm dòng này
const orderRoutes = require('./src/routes/orderRoutes');
const cookieParser = require("cookie-parser");
const auth = require('./src/utils/auth');
const roleMiddleware = require('./src/middleware/roleMiddleware'); // Import middleware kiểm tra quyền
const authMiddleware = require('./src/middleware/authMiddleware'); // Import middleware xác thực người dùng
const orderModel = require('./src/models/orderModel'); // Import model đơn hàng
const adminProductRoutes = require('./src/routes/adminProductRoutes'); // Import admin product routes
const checkAuth = require('./src/middleware/authMiddleware'); // Import the checkAuth middleware
const checkAdmin = require('./src/middleware/roleMiddleware'); // Import the checkAdmin middleware
const adminUserRoutes = require('./src/routes/adminUserRoutes'); // Import admin user routes
const adminBrandRoutes = require('./src/routes/adminBrandRoutes');
const adminCategoryRoutes = require('./src/routes/adminCategoryRoutes');
const adminOrderRoutes = require('./src/routes/adminOrderRoutes');


require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads')); // Phục vụ ảnh từ thư mục uploads

// Cấu hình middleware
app.use(express.urlencoded({ extended: true })); // Để xử lý form
app.use(express.json()); // Để xử lý JSON

// Cấu hình express-session
app.use(session({
    secret: 'your-secret-key', // Thay bằng một chuỗi bí mật của bạn
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Đặt secure: true nếu dùng HTTPS
}));

// Cấu hình connect-flash
app.use(flash());

// Truyền flash messages vào tất cả các view
app.use((req, res, next) => {
    res.locals.messages = req.flash(); // Gán flash messages vào res.locals để dùng trong view
    next();
});

app.set('view engine', 'pug');
app.set('views', './src/views');
app.use(cookieParser()); // Thêm dòng này
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);  // Thêm route giỏ hàng
// Use the order routes
app.use('/api/orders', orderRoutes);

app.use(function (req, res, next) {
    const token = req.cookies.accessToken;
    const checkUser = auth.verifyAccessToken(token);
    if (checkUser) {
        res.locals.user = checkUser;
    }
    next();
}); 

// Route hiển thị danh sách sản phẩm từ API
app.get('/', async (req, res) => {
    try {
        const { category_id, brand_id } = req.query;

        // Fetch products with filters
        const response = await axios.get('http://localhost:3000/api/products', {
            params: { category_id, brand_id }
        });
        const products = response.data.data || [];

        // Fetch categories and brands
        const categoriesResponse = await axios.get('http://localhost:3000/api/products/categories');
        const brandsResponse = await axios.get('http://localhost:3000/api/products/brands');
        const categories = categoriesResponse.data.data || [];
        const brands = brandsResponse.data.data || [];

        res.render('index', { products, categories, brands });
    } catch (error) {
        console.error('Lỗi khi lấy sản phẩm:', error);
        res.render('index', { products: [], categories: [], brands: [] });
    }
});

// Route hiển thị trang đăng nhập
app.get('/login', (req, res) => {
    res.render('login');
});

// Route hiển thị trang đăng ký
app.get('/register', (req, res) => {
    res.render('register');
});

// Route hiển thị chi tiết sản phẩm từ API
app.get('/product-detail/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const response = await axios.get(`http://localhost:3000/api/products/${productId}`); // Gọi API lấy chi tiết sản phẩm
        const product = response.data.data; // Đảm bảo rằng dữ liệu trả về có đúng cấu trúc

        if (!product) {
            return res.status(404).render('product-detail', { product: null });
        }

        res.render('product-detail', { product });
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
        res.render('product-detail', { product: null }); // Nếu có lỗi, hiển thị trang chi tiết rỗng
    }
});
app.get('/cart', (req, res) => {
    res.render('cart');
});

app.get('/api/orders/checkout', async (req, res) => {
    try {
        if (!res.locals.user) {
            return res.redirect('/login'); // Redirect to login if the user is not authenticated
        }

        const userId = res.locals.user.userId; // Get userId from authenticated user
        const response = await axios.get(`http://localhost:3000/api/cart`, {
            headers: { Cookie: `accessToken=${req.cookies.accessToken}` }, // Pass the token in the request
        });

        const cartItems = response.data.cartItems || []; // Ensure cartItems is an array
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        res.render('checkout', { cartItems, total, user: res.locals.user });
    } catch (error) {
        console.error('Error rendering checkout page:', error);
        res.render('checkout', { cartItems: [], total: 0, user: res.locals.user });
    }
});

/// Đảm bảo route trong server.js được định nghĩa trước app.use('/api/orders', orderRoutes)
app.get('/api/orders/history', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId; // Lấy userId từ req.user (được thiết lập bởi authMiddleware)
        const orders = await orderModel.getOrderHistoryByUserId(userId); // Lấy danh sách đơn hàng

        res.render('order-history', { orders, user: req.user }); // Render template order-history.pug
    } catch (error) {
        console.error('Error rendering order history:', error);
        res.render('order-history', { orders: [], user: req.user }); // Nếu có lỗi, truyền mảng rỗng
    }
});
app.get('/api/orders/detail/:orderId', authMiddleware, async (req, res) => {
    try {
        const { orderId } = req.params; // Lấy orderId từ params
        const userId = req.user.userId; // Lấy userId từ req.user (được thiết lập bởi authMiddleware)

        // Fetch the order details
        const order = await orderModel.getOrderById(orderId, userId); // Lấy thông tin đơn hàng
        if (!order) {
            return res.status(404).render('order-detail', { order: null, items: [] }); // Nếu không tìm thấy đơn hàng, trả về 404
        }

        // Fetch the items in the order
        const items = await orderModel.getOrderItemsByOrderId(orderId); // Lấy danh sách sản phẩm trong đơn hàng

        res.render('order-detail', { order, items, user: req.user }); // Render template order-detail.pug
    } catch (error) {
        console.error('Error rendering order detail:', error);
        res.render('order-detail', { order: null, items: [] }); // Nếu có lỗi, truyền mảng rỗng
    }
});

// Admin dashboard route
app.get('/admin', checkAuth, checkAdmin, (req, res) => {
    res.render('admin/admin-layout', { user: res.locals.user });
});
// Use the admin product routes
app.use('/admin/products', adminProductRoutes);
app.use('/admin/users', adminUserRoutes);
app.use('/admin/brands', adminBrandRoutes);
app.use('/admin/categories', adminCategoryRoutes);
app.use('/admin/orders', adminOrderRoutes);


app.get('/logout', (req, res) => {
    res.clearCookie('accessToken');
    res.redirect('/');
    
});

// app.get('/profile', (req, res) => {
//     res.render('profile');
// });
// Route trang admin chính
// app.get('/admin/layout', (req, res) => {
//     res.render('layout');
// });
 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
