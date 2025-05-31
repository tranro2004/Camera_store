const express = require('express');
const router = express.Router();
const checkAdmin = require('../middleware/roleMiddleware'); // Middleware to check admin role
const checkAuth = require('../middleware/authMiddleware'); // Middleware to check authentication
const { productController, upload } = require('../controllers/productController');

// Admin dashboard for products
router.get('/', checkAuth, checkAdmin, async (req, res) => {
    try {
        const products = await productController.getAllProductsForAdmin();
        res.render('admin/product/products', { products, user: req.user });
    } catch (error) {
        console.error('Error rendering admin products page:', error);
        res.status(500).send('Error loading admin products page');
    }
});

// Add product page
router.get('/add', checkAuth, checkAdmin, (req, res) => {
    res.render('admin/product/add-product', { user: req.user });
    
});

// Edit product page
router.get('/edit/:id', checkAuth, checkAdmin, async (req, res) => {
    try {
        const product = await productController.getProductByIdForAdmin(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('admin/product/edit-product', { product, user: req.user });
    } catch (error) {
        console.error('Error rendering edit product page:', error);
        res.status(500).send('Error loading edit product page');
    }
});

// Handle CRUD operations
router.post('/', checkAuth, checkAdmin, upload.single('image_url'), async (req, res) => {
    try {
        const result = await productController.addProduct(req, res);
        if (result.success) {
            req.flash('success', 'Thêm sản phẩm thành công!');
            res.redirect('/admin/products');
        } else {
            req.flash('error', 'Thêm sản phẩm thất bại!');
            res.redirect('/admin/products/add');
        }
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error.message);
        req.flash('error', error.message || 'Lỗi khi thêm sản phẩm');
        res.redirect('/admin/products/add');
    }
});
router.put('/:id', checkAuth, checkAdmin, upload.single('image_url'), async (req, res) => {
    try {
        const { name, description, price, quantity, category_id, brand_id } = req.body;
        const image_url = req.file ? req.file.filename : null;

        await productController.updateProduct(req.params.id, {
            name,
            description,
            price,
            quantity,
            category_id,
            brand_id,
            image_url,
        });

        res.redirect('/admin/products');
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).send('Error updating product');
    }
});
router.delete('/:id', checkAuth, checkAdmin, async (req, res) => {
    try {
        await productController.deleteProduct(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: 'Error deleting product' });
    }
});

module.exports = router;