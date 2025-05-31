const Product = require('../models/productModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const checkAdmin = require('../middleware/roleMiddleware'); // Import middleware kiểm tra quyền admin
const categoryModel = require('../models/categoryModel');
const brandModel = require('../models/brandModel');



// Đảm bảo thư mục uploads tồn tại
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Cấu hình Multer để lưu ảnh vào thư mục uploads/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Lưu ảnh vào thư mục uploads
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Tạo tên file duy nhất
    }
});

// Bộ lọc file (chỉ chấp nhận ảnh PNG, JPG, JPEG)
const fileFilter = (req, file, cb) => {
    console.log("📸 Định dạng file nhận được:", file.mimetype); // Debug file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        console.error("❌ File bị từ chối: ", file.mimetype); // In ra lỗi nếu bị từ chối
        cb(new Error('Chỉ chấp nhận file ảnh PNG, JPG, JPEG!'), false);
    }
};


const upload = multer({ storage: storage, fileFilter: fileFilter });


class ProductController {
    async getAllProducts(req, res) {
        try {
            const { category_id, brand_id } = req.query; // Get filters from query parameters
            const filters = {};
        
            if (category_id) filters.category_id = category_id;
            if (brand_id) filters.brand_id = brand_id;
        
            const products = await Product.getAllProducts(filters);
            res.json({ success: true, data: products });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách sản phẩm" });
        }
    }

    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.getProductById(id);
    
            if (!product) {
                return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm!" });
            }
    
            // Ensure the image_url is correctly formatted
            const imageUrl = product.image_url ? `http://localhost:3000/uploads/${product.image_url}` : null;
    
            res.json({
                success: true,
                data: { ...product, image_url: imageUrl }
            });
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
            res.status(500).json({ success: false, message: "Lỗi khi lấy sản phẩm" });
        }
    }
        // Lấy chi tiết sản phẩm
    async getProductDetail(req, res) {
        try {
        const productId = req.params.productId;  // Lấy ID sản phẩm từ URL
        const product = await Product.getProductById(productId);  // Truy vấn sản phẩm từ database
    
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });  // Nếu không tìm thấy sản phẩm, trả về lỗi
        }
    
        // Chuyển đổi hình ảnh của sản phẩm thành URL hợp lệ (nếu có)
        const imageUrl = product.image_url ? `http://localhost:3000/uploads/${product.image_url}` : null;
    
        // Gửi dữ liệu sản phẩm đã lấy tới view
        res.render('product-detail', {
            product: {
            ...product,
            image_url: imageUrl  // Đảm bảo rằng image_url là URL đầy đủ
            }
        });
        } catch (error) {
        console.error('Error fetching product details:', error);
        res.status(500).json({ message: 'Có lỗi khi lấy thông tin sản phẩm', error });
        }
    };

    async addProduct(req, res) {
        try {
            // Kiểm tra quyền admin
            if (req.user.role !== 'admin') {
                throw new Error("Bạn không có quyền thêm sản phẩm!");
            }
    
            const { name, description, price, quantity, category_id, brand_id } = req.body;
            let image_url = null;
    
            // Nếu có file ảnh thì lưu đường dẫn
            if (req.file) {
                image_url = req.file.filename;
            }
    
            // Kiểm tra nếu thiếu trường bắt buộc
            if (!name || !description || !price || !quantity || !category_id || !brand_id) {
                throw new Error("Vui lòng điền đầy đủ thông tin sản phẩm!");
            }
    
            const productId = await Product.addProduct({ name, description, price, quantity, image_url, category_id, brand_id });
    
            return {
                success: true,
                message: "Thêm sản phẩm thành công!",
                productId,
                data: { name, description, price, quantity, image_url, category_id, brand_id }
            };
        } catch (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
            throw error; // Ném lỗi để route xử lý
        }
    }
    

    async updateProduct(req, res) {
        try {
            // Kiểm tra quyền admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Bạn không có quyền sửa sản phẩm!" });
            }

            const { id } = req.params;
            const updatedProduct = req.body;
    
            if (req.file) {
                updatedProduct.image_url = req.file.filename; // Chỉ lưu tên file ảnh
            }
    
            const success = await Product.updateProduct(id, updatedProduct);
    
            if (!success) {
                return res.status(404).json({ success: false, message: "Sản phẩm không tồn tại!" });
            }
    
            res.json({ success: true, message: "Cập nhật sản phẩm thành công!", data: updatedProduct });
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
            res.status(500).json({ success: false, message: "Lỗi khi cập nhật sản phẩm" });
        }
    }
    

    async deleteProduct(req, res) {
        try {
            // Kiểm tra quyền admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Bạn không có quyền xóa sản phẩm!" });
            }

            const { id } = req.params;
            const success = await Product.deleteProduct(id);

            if (!success) {
                return res.status(404).json({ success: false, message: "Sản phẩm không tồn tại!" });
            }

            res.json({ success: true, message: "Xóa sản phẩm thành công!" });
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            res.status(500).json({ success: false, message: "Lỗi khi xóa sản phẩm" });
        }
    }

    

    // Lấy danh sách danh mục
    async getCategories(req, res) {
        try {
            const categories = await categoryModel.getAllCategories();
            if (!categories || categories.length === 0) {
                return res.status(404).json({ success: false, message: "Không có danh mục nào!" });
            }
            res.status(200).json({ success: true, data: categories });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách danh mục:", error.message);
            res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách danh mục", error: error.message });
        }
    }

    // Lấy danh mục theo ID
    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await categoryModel.getCategoryById(id);
            if (!category) {
                return res.status(404).json({ success: false, message: "Danh mục không tồn tại!" });
            }
            res.status(200).json({ success: true, data: category });
        } catch (error) {
            console.error("Lỗi khi lấy danh mục:", error.message);
            res.status(500).json({ success: false, message: "Lỗi khi lấy danh mục", error: error.message });
        }
    }

    // Thêm danh mục mới
    async addCategory(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Bạn không có quyền thêm danh mục!" });
            }

            const { name, description } = req.body;
            if (!name) {
                return res.status(400).json({ success: false, message: "Tên danh mục là bắt buộc!" });
            }

            const categoryId = await categoryModel.addCategory({ name, description });
            res.status(201).json({
                success: true,
                message: "Thêm danh mục thành công!",
                data: { categoryId, name, description }
            });
        } catch (error) {
            console.error("Lỗi khi thêm danh mục:", error.message);
            res.status(500).json({ success: false, message: "Lỗi khi thêm danh mục", error: error.message });
        }
    }

    // Cập nhật danh mục
    async updateCategory(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Bạn không có quyền sửa danh mục!" });
            }

            const { id } = req.params;
            const { name, description } = req.body;

            const category = await categoryModel.getCategoryById(id);
            if (!category) {
                return res.status(404).json({ success: false, message: "Danh mục không tồn tại!" });
            }

            const success = await categoryModel.updateCategory(id, { name, description });
            if (!success) {
                return res.status(500).json({ success: false, message: "Không thể cập nhật danh mục!" });
            }

            res.status(200).json({ success: true, message: "Cập nhật danh mục thành công!" });
        } catch (error) {
            console.error("Lỗi khi cập nhật danh mục:", error.message);
            res.status(500).json({ success: false, message: "Lỗi khi cập nhật danh mục", error: error.message });
        }
    }

    // Xóa danh mục
    async deleteCategory(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Bạn không có quyền xóa danh mục!" });
            }

            const { id } = req.params;
            const category = await categoryModel.getCategoryById(id);
            if (!category) {
                return res.status(404).json({ success: false, message: "Danh mục không tồn tại!" });
            }

            const success = await categoryModel.deleteCategory(id);
            if (!success) {
                return res.status(500).json({ success: false, message: "Không thể xóa danh mục!" });
            }

            res.status(200).json({ success: true, message: "Xóa danh mục thành công!" });
        } catch (error) {
            console.error("Lỗi khi xóa danh mục:", error.message);
            res.status(500).json({ success: false, message: "Lỗi khi xóa danh mục", error: error.message });
        }
    }

    // Lấy danh sách thương hiệu
    async getBrands(req, res) {
        try {
            const brands = await brandModel.getAllBrands();
            res.status(200).json({ success: true, data: brands });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thương hiệu:", error.message);
            res.status(500).json({ success: false, message: "Lỗi khi lấy danh sách thương hiệu", error: error.message });
        }
    }

    // Lấy thương hiệu theo ID
    async getBrandById(req, res) {
        try {
            const { id } = req.params;
            const brand = await brandModel.getBrandById(id);
            if (!brand) {
                return res.status(404).json({ success: false, message: "Thương hiệu không tồn tại!" });
            }
            res.status(200).json({ success: true, data: brand });
        } catch (error) {
            console.error("Lỗi khi lấy thương hiệu:", error.message);
            res.status(500).json({ success: false, message: "Lỗi khi lấy thương hiệu", error: error.message });
        }
    }

    // Thêm thương hiệu mới
    async addBrand(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Bạn không có quyền thêm thương hiệu!" });
            }

            const { name, logo_url, description } = req.body;
            if (!name) {
                return res.status(400).json({ success: false, message: "Tên thương hiệu là bắt buộc!" });
            }

            const brandId = await brandModel.addBrand({ name, logo_url, description });
            res.status(201).json({
                success: true,
                message: "Thêm thương hiệu thành công!",
                data: { brandId, name, logo_url, description }
            });
        } catch (error) {
            console.error("Lỗi khi thêm thương hiệu:", error.message);
            res.status(500).json({ success: false, message: "Lỗi khi thêm thương hiệu", error: error.message });
        }
    }

    // Cập nhật thương hiệu
    async updateBrand(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Bạn không có quyền sửa thương hiệu!" });
            }

            const { id } = req.params;
            const { name, logo_url, description } = req.body;

            const brand = await brandModel.getBrandById(id);
            if (!brand) {
                return res.status(404).json({ success: false, message: "Thương hiệu không tồn tại!" });
            }

            const success = await brandModel.updateBrand(id, { name, logo_url, description });
            if (!success) {
                return res.status(500).json({ success: false, message: "Không thể cập nhật thương hiệu!" });
            }

            res.status(200).json({ success: true, message: "Cập nhật thương hiệu thành công!" });
        } catch (error) {
            console.error("Lỗi khi cập nhật thương hiệu:", error.message);
            res.status(500).json({ success: false, message: "Lỗi khi cập nhật thương hiệu", error: error.message });
        }
    }

    // Xóa thương hiệu
    async deleteBrand(req, res) {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Bạn không có quyền xóa thương hiệu!" });
            }

            const { id } = req.params;
            const brand = await brandModel.getBrandById(id);
            if (!brand) {
                return res.status(404).json({ success: false, message: "Thương hiệu không tồn tại!" });
            }

            const success = await brandModel.deleteBrand(id);
            if (!success) {
                return res.status(500).json({ success: false, message: "Không thể xóa thương hiệu!" });
            }

            res.status(200).json({ success: true, message: "Xóa thương hiệu thành công!" });
        } catch (error) {
            console.error("Lỗi khi xóa thương hiệu:", error.message);
            res.status(500).json({ success: false, message: "Lỗi khi xóa thương hiệu", error: error.message });
        }
    }

    async getAllProductsForAdmin(req, res) {
        try {
            const products = await Product.getAllProducts();
            return products;
        } catch (error) {
            console.error('Error fetching products for admin:', error);
            throw error;
        }
    }
    
    async getProductByIdForAdmin(productId) {
        try {
            const product = await Product.getProductById(productId);
            return product;
        } catch (error) {
            console.error('Error fetching product by ID for admin:', error);
            throw error;
        }
    }

}


module.exports = { productController: new ProductController(), upload, } ;
