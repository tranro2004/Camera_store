const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const checkAuth = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/roleMiddleware');

router.get('/',checkAuth, checkAdmin, userController.getAllUsers);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get("/logout", userController.logout);

// 🗑 Xóa người dùng
router.delete("/:id",checkAuth, checkAdmin, userController.deleteUser);

// ✏️ Cập nhật người dùng
router.put("/:id", userController.updateUser);

//router.get("/profile/amdin-profile", checkAuth, userController.getUserProfile);

module.exports = router;
