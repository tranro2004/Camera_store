const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/authMiddleware'); // Middleware for authentication
const checkAdmin = require('../middleware/roleMiddleware'); // Middleware for admin role
const userController = require('../controllers/userController');

// Get all users
router.get('/', checkAuth, checkAdmin, async (req, res) => {
    try {
        const result = await userController.getAllUsers(req);
        if (result.success) {
            res.render('admin/user/users', { users: result.data, user: req.user });
        } else {
            res.render('admin/user/users', { users: [], error: result.message, user: req.user });
        }
    } catch (error) {
        console.error('Error rendering users page:', error);
        res.render('admin/user/users', { users: [], error: 'Lỗi khi tải danh sách người dùng', user: req.user });
    }
});

// Add user page
router.get('/add', checkAuth, checkAdmin, (req, res) => {
    res.render('admin/user/add-user', { user: req.user });
});

// Add user
router.post('/add', checkAuth, checkAdmin, async (req, res) => {
    try {
        await userController.register(req, res);
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Error adding user');
    }
});

// Edit user page
router.get('/edit/:id', checkAuth, checkAdmin, async (req, res) => {
    try {
        const user = await userController.getUserById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('admin/user/edit-user', { user, currentUser: req.user });
    } catch (error) {
        console.error('Error rendering edit user page:', error);
        res.status(500).send('Error loading edit user page');
    }
});

// Edit user
router.post('/edit/:id', checkAuth, checkAdmin, async (req, res) => {
    try {
        await userController.updateUser(req, res);
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
});

// Delete user
router.post('/delete/:id', checkAuth, checkAdmin, async (req, res) => {
    try {
        await userController.deleteUser(req, res);
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
});

module.exports = router;