const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/roleMiddleware');
const categoryController = require('../controllers/categoryController');

// Get all categories
router.get('/', checkAuth, checkAdmin, categoryController.getAllCategories);

// Add category page
router.get('/add', checkAuth, checkAdmin, (req, res) => {
    res.render('admin/category/add-category', { user: req.user });
    res.redirect('/admin/categories');
});

// Add category
router.post('/add', checkAuth, checkAdmin, categoryController.addCategory);

// Edit category page
router.get('/edit/:id', checkAuth, checkAdmin, categoryController.getCategoryByIdForEdit);

// Edit category
router.post('/edit/:id', checkAuth, checkAdmin, categoryController.updateCategory);

// Delete category
router.post('/delete/:id', checkAuth, checkAdmin, categoryController.deleteCategory);

module.exports = router;