const jwt = require('jsonwebtoken');
const auth = require('../utils/auth'); // Đảm bảo bạn đã định nghĩa verifyAccessToken trong utils/auth.js

const checkAuth = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Chưa đăng nhập' });
    }

    try {
        const decoded = auth.verifyAccessToken(token);
        req.user = decoded; // Attach user info to the request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

module.exports = checkAuth;

//     if (!token) {
//         return res.status(401).json({ error: "Chưa đăng nhập" });
//     }

//     try {
//         const decoded = auth.verifyAccessToken(token);
//         console.log("Decoded user data:", decoded);  // Log giá trị của decoded

//         if (!decoded || !decoded.userId) {
//             return res.status(401).json({ error: "Token không hợp lệ hoặc không có thông tin userId" });
//         }

//         req.user = decoded;  // Gán decoded vào req.user
//         next();
//     } catch (error) {
//         return res.status(401).json({ error: "Token không hợp lệ" });
//     }
// };



