const pool = require('../utils/connectDB');

class Product {
    // Lấy danh sách tất cả sản phẩm
    static async getAllProducts(filters = {}) {
        let sql = 'SELECT * FROM products WHERE 1=1';
        const params = [];
    
        if (filters.category_id) {
            const categoryIds = filters.category_id.split(',').map(id => parseInt(id));
            sql += ` AND category_id IN (${categoryIds.map(() => '?').join(',')})`;
            params.push(...categoryIds);
        }
    
        if (filters.brand_id) {
            const brandIds = filters.brand_id.split(',').map(id => parseInt(id));
            sql += ` AND brand_id IN (${brandIds.map(() => '?').join(',')})`;
            params.push(...brandIds);
        }
    
        const [rows] = await pool.execute(sql, params);
        return rows;
    }

    // Lấy sản phẩm theo ID
    static async getProductById(productId) {
        const sql = 'SELECT * FROM products WHERE product_id = ?';
        const [rows] = await pool.execute(sql, [productId]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async addProduct({ name, description, price, quantity, image_url, category_id, brand_id }) {
        const sql = `INSERT INTO products (name, description, price, quantity, image_url, created_at, category_id, brand_id) 
                     VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)`; 
        const [result] = await pool.execute(sql, [name, description, price, quantity, image_url, category_id, brand_id]);
        return result.insertId;
    }

    // Cập nhật sản phẩm
    static async updateProduct(productId, updatedProduct) {
        const product = await Product.getProductById(productId);
        if (!product) throw new Error("Sản phẩm không tồn tại!");
    
        const name = updatedProduct.name ?? product.name;
        const description = updatedProduct.description ?? product.description;
        const price = updatedProduct.price ?? product.price;
        const quantity = updatedProduct.quantity ?? product.quantity;
        const image_url = updatedProduct.image_url ?? product.image_url;
        const category_id = updatedProduct.category_id ?? product.category_id;
        const brand_id = updatedProduct.brand_id ?? product.brand_id;
    
        const sql = `UPDATE products 
                     SET name = ?, description = ?, price = ?, quantity = ?, image_url = ?, category_id = ?, brand_id = ?
                     WHERE product_id = ?`;
        const [result] = await pool.execute(sql, [name, description, price, quantity, image_url, category_id, brand_id, productId]);
    
        return result.affectedRows > 0;
    }
    

    // Xóa sản phẩm theo ID
    static async deleteProduct(productId) {
        const sql = 'DELETE FROM products WHERE product_id = ?';
        const [result] = await pool.execute(sql, [productId]);
        return result.affectedRows > 0;
    }
}

module.exports = Product;
