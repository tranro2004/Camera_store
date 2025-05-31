const db = require('../utils/connectDB');

// Lấy danh sách tất cả thương hiệu
const getAllBrands = async () => {
    const query = 'SELECT brand_id AS id, name, logo_url, description, created_at FROM brand';
    try {
        const [rows] = await db.query(query);
        return rows;
    } catch (error) {
        throw new Error('Lỗi khi lấy danh sách thương hiệu: ' + error.message);
    }
};

// Lấy thương hiệu theo ID
const getBrandById = async (brandId) => {
    const query = 'SELECT brand_id AS id, name, logo_url, description, created_at FROM brand WHERE brand_id = ?';
    try {
        const [rows] = await db.query(query, [brandId]);
        return rows[0];
    } catch (error) {
        throw new Error('Lỗi khi lấy thương hiệu: ' + error.message);
    }
};

// Thêm thương hiệu mới
const addBrand = async (brand) => {
    const { name, logo_url, description } = brand;
    const query = 'INSERT INTO brand (name, logo_url, description) VALUES (?, ?, ?)';
    try {
        const [result] = await db.query(query, [name, logo_url, description]);
        return result.insertId;
    } catch (error) {
        throw new Error('Lỗi khi thêm thương hiệu: ' + error.message);
    }
};

// Cập nhật thương hiệu
const updateBrand = async (brandId, brand) => {
    const { name, logo_url, description } = brand;
    const query = 'UPDATE brand SET name = ?, logo_url = ?, description = ? WHERE brand_id = ?';
    try {
        const [result] = await db.query(query, [name, logo_url, description, brandId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Lỗi khi cập nhật thương hiệu: ' + error.message);
    }
};

// Xóa thương hiệu
const deleteBrand = async (brandId) => {
    const query = 'DELETE FROM brand WHERE brand_id = ?';
    try {
        const [result] = await db.query(query, [brandId]);
        return result.affectedRows > 0;
    } catch (error) {
        throw new Error('Lỗi khi xóa thương hiệu: ' + error.message);
    }
};

module.exports = {
    getAllBrands,
    getBrandById,
    addBrand,
    updateBrand,
    deleteBrand,
};