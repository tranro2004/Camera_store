const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/authMiddleware');
const checkAdmin = require('../middleware/roleMiddleware');
const brandController = require('../controllers/brandController');

// Get all brands
router.get('/', checkAuth, checkAdmin, brandController.getAllBrands);

// Add brand page
router.get('/add', checkAuth, checkAdmin, (req, res) => {
    res.render('admin/brand/add-brand', { user: req.user });
    
});

// Add brand
router.post('/add', checkAuth, checkAdmin, brandController.addBrand);

// Edit brand page
router.get('/edit/:id', checkAuth, checkAdmin, brandController.getBrandByIdForEdit);

// Edit brand
router.post('/edit/:id', checkAuth, checkAdmin, brandController.updateBrand);

// Delete brand
router.post('/delete/:id', checkAuth, checkAdmin, brandController.deleteBrand);

module.exports = router;