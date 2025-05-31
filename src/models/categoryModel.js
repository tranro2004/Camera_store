const db = require('../utils/connectDB');


// Lấy danh sách tất cả danh mục
// Lấy danh sách tất cả danh mục
// Lấy danh sách tất cả danh mục
const getAllCategories = async () => {
    const query = 'SELECT category_id AS id, name, description, created_at FROM category';
    try {
        const [rows] = await db.query(query);
        return rows;
    } catch (error) {
        throw new Error('Lỗi khi lấy danh sách danh mục: ' + error.message);
    }
};

// Lấy danh mục theo ID
const getCategoryById = async (categoryId) => {
    const query = 'SELECT category_id AS id, name, description, created_at FROM category WHERE category_id = ?';
    try {
        const [rows] = await db.query(query, [categoryId]);
        return rows[0];
    } catch (error) {
        throw new Error('Lỗi khi lấy danh mục: ' + error.message);
    }
};


// Thêm danh mục mới
const addCategory = async (category) => {
    const { name, description } = category;
    const query = 'INSERT INTO category (name, description) VALUES (?, ?)';
    try {
        const [result] = await db.query(query, [name, description]);
        return result.insertId;
    } catch (error) {
        throw new Error('Lỗi khi thêm danh mục: ' + error.message);
    }
};

// Cập nhật danh mục
const updateCategory = async (categoryId, category) => {
    const { name, description } = category;
    const query = 'UPDATE category SET name = ?, description = ? WHERE category_id = ?';
    try {
        const [result] = await db.query(query, [name, description, categoryId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Lỗi khi cập nhật danh mục: ' + error.message);
    }
};

// Xóa danh mục
const deleteCategory = async (categoryId) => {
    const query = 'DELETE FROM category WHERE category_id = ?';
    try {
        const [result] = await db.query(query, [categoryId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Lỗi khi xóa danh mục: ' + error.message);
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory,
};