const express = require('express');
const router = express.Router();
const checkAdmin = require('../middleware/roleMiddleware'); // Import middleware kiểm tra quyền admin
const checkAuth = require('../middleware/authMiddleware'); // Kiểm tra xác thực người dùng (token)


const { productController, upload } = require('../controllers/productController'); 

// Route để lấy danh sách danh mục
router.get('/categories', (req, res) => productController.getCategories(req, res));
router.get('/categories/:id', productController.getCategoryById);
router.post('/categories', checkAuth, checkAdmin, productController.addCategory);
router.put('/categories/:id', checkAuth, checkAdmin, productController.updateCategory);
router.delete('/categories/:id', checkAuth, checkAdmin, productController.deleteCategory);

// Các route cho thương hiệu
router.get('/brands', productController.getBrands);
router.get('/brands/:id', productController.getBrandById);
router.post('/brands', checkAuth, checkAdmin, productController.addBrand);
router.put('/brands/:id', checkAuth, checkAdmin, productController.updateBrand);
router.delete('/brands/:id', checkAuth, checkAdmin, productController.deleteBrand);



// Lấy tất cả sản phẩm
router.get('/', async (req, res) => productController.getAllProducts(req, res));

// Lấy sản phẩm theo ID
router.get('/:id', (req, res) => productController.getProductById(req, res));

router.post('/', checkAuth, checkAdmin, upload.single('image_url'), (req, res) => productController.addProduct(req, res));
router.put('/:id', checkAuth, checkAdmin, upload.single('image_url'), (req, res) => productController.updateProduct(req, res));
router.delete('/:id', checkAuth, checkAdmin, (req, res) => productController.deleteProduct(req, res));




module.exports = router;
