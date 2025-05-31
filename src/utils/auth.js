const jwt = require('jsonwebtoken');

const generateAccessToken = (payload) =>{
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
    })
}
// trả về payload 1: đúng key, 2: còn thời gian sử dụng
const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded; // Trả về payload (thông tin người dùng)
    } catch (error) {
        return null;  // Nếu token không hợp lệ, trả về null
    }
}

module.exports = {
    generateAccessToken, verifyAccessToken
}