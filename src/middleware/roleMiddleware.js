// src/middleware/roleMiddleware.js
const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next(); // Nếu là admin, tiếp tục
    }
    return res.status(403).json({ error: "Bạn không có quyền truy cập" }); // Nếu không phải admin, trả về lỗi
};

module.exports = checkAdmin;
