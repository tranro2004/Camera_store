const pool = require('../utils/connectDB');

class User {
    // Lấy tất cả người dùng (ẩn mật khẩu để bảo mật)
    static async getAll() {
        const sql = "SELECT user_id, name, email, phone, address, role, created_at FROM users";
        const [rows] = await pool.execute(sql);
        return rows;
    }

    // Lấy thông tin người dùng bằng email
    static async getUserByEmail(email) {
        const sql = "SELECT * FROM users WHERE email = ?";
        const [rows] = await pool.execute(sql, [email]);
        return rows.length > 0 ? rows[0] : null;
    }

     // ✅ Thêm hàm getUserById để lấy người dùng theo ID
     static async getUserById(userId) {
        const sql = "SELECT * FROM users WHERE user_id = ?";
        const [rows] = await pool.execute(sql, [userId]);
        return rows.length > 0 ? rows[0] : null;
    }
    // Kiểm tra xem có admin nào trong DB chưa
    static async hasAdmin() {
        const sql = "SELECT COUNT(*) AS count FROM users WHERE role = 'admin'";
        const [rows] = await pool.execute(sql);
        return rows[0].count > 0;
    }

    // Tạo người dùng mới
    static async create(user) {
        if (user.role === 'admin') {
            const adminExists = await this.hasAdmin();
            if (adminExists) {
                throw new Error("Chỉ có thể có 1 admin trong hệ thống!");
            }
        }

        const sql = "INSERT INTO users (name, email, phone, address, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())";
        await pool.execute(sql, [user.name, user.email, user.phone, user.address, user.password, user.role]);
    }

     // 🗑 Xóa người dùng theo ID
     static async delete(userId) {
        const sql = "DELETE FROM users WHERE user_id = ?";
        const [result] = await pool.execute(sql, [userId]);
        return result.affectedRows > 0; // Trả về true nếu xóa thành công
    }

    static async update(userId, updatedUser) {
        // Lấy thông tin hiện tại của user
        const user = await this.getUserById(userId);
        if (!user) {
            throw new Error("Người dùng không tồn tại!");
        }
    
        // Nếu một trường không được gửi, giữ nguyên giá trị cũ
        const name = updatedUser.name ?? user.name;
        const email = updatedUser.email ?? user.email;
        const phone = updatedUser.phone ?? user.phone;
        const address = updatedUser.address ?? user.address;
    
        // Cập nhật thông tin user
        const sql = "UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE user_id = ?";
        const [result] = await pool.execute(sql, [name, email, phone, address, userId]);
    
        return result.affectedRows > 0; // Trả về true nếu cập nhật thành công
    }

    static async logout(userId) {
        const sql = "UPDATE users SET refresh_token = NULL WHERE user_id = ?";
        await pool.execute(sql, [userId]);
    }
    
}

module.exports = User;
