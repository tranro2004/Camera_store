const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const auth = require('../utils/auth');
const jwt = require('jsonwebtoken');
const checkAdmin = require('../middleware/roleMiddleware'); // Import middleware kiểm tra quyền admin




class UserController {
    async getAllUsers(req) {
        try {
            // Kiểm tra quyền admin
            if (req.user.role !== 'admin') {
                throw new Error("Bạn không có quyền truy cập danh sách người dùng!");
            }

            const users = await User.getAll();
            return { success: true, data: users };
        } catch (error) {
            console.error("Lỗi lấy danh sách users:", error);
            return { success: false, message: error.message || "Lỗi máy chủ" };
        }
    }

    async register(req, res) {
        try {
            console.log("Dữ liệu nhận được:", req.body);
            const { name, email, phone, address, password, role } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
            }

            // Kiểm tra xem email đã tồn tại chưa
            const existingUser = await User.getUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: "Email đã tồn tại!" });
            }

            // Xác định role
            let userRole = role === 'admin' ? 'admin' : 'user';
            if (userRole === 'admin') {
                const hasAdmin = await User.hasAdmin();
                if (hasAdmin) {
                    return res.status(400).json({ error: "Chỉ có thể có 1 admin trong hệ thống!" });
                }
            }

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo user
            await User.create({ name, email, phone, address, password: hashedPassword, role: userRole });

            res.status(201).json({ message: "Đăng ký thành công!" });
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);
            res.status(500).json({ error: "Lỗi máy chủ" });
        }
    }

    async login(req, res) {
        try {
            console.log("Dữ liệu đăng nhập:", req.body);
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Thiếu email hoặc mật khẩu" });
            }

            const user = await User.getUserByEmail(email);
            if (!user) {
                return res.status(400).json({ error: "Tài khoản không tồn tại" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Sai mật khẩu" });
            }

           // Tạo JWT token
           const currentUser = {
            userId: user.user_id,
            email: user.email,
            role: user.role
           }
           const accessToken = auth.generateAccessToken(currentUser);
           res.cookie('accessToken', accessToken, {
                httpOnly: true
            });
            res.json({ message: "Đăng nhập thành công", token: accessToken });

           
        }catch (error) {
            console.error("Lỗi khi đăng nhập:", error);
            res.status(500).json({ error: "Lỗi máy chủ" });
        }

    }


    // 🗑 Xóa người dùng theo ID
    async deleteUser(req, res) {
        try {
            // Kiểm tra quyền admin
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: "Bạn không có quyền xóa người dùng!" });
            }

            const userId = req.params.id;

            const user = await User.getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: "Người dùng không tồn tại!" });
            }

            await User.delete(userId);
            res.status(200).json({ message: "Người dùng đã bị xóa!" });
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
            res.status(500).json({ error: "Lỗi máy chủ" });
        }
    }

    // ✏️ Cập nhật thông tin người dùng
    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const { name, email, phone, address, role } = req.body;

            console.log("Cập nhật user ID:", userId);

            // Kiểm tra user có tồn tại không
            const user = await User.getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: "Người dùng không tồn tại!" });
            }

            // Nếu đang cập nhật email, kiểm tra xem email đã tồn tại chưa
            if (email && email !== user.email) {
                const existingUser = await User.getUserByEmail(email);
                if (existingUser) {
                    return res.status(400).json({ error: "Email đã tồn tại!" });
                }
            }

            // Nếu user không phải admin, không cho phép đổi role thành admin
            if (role === 'admin' && user.role !== 'admin') {
                return res.status(400).json({ error: "Không thể chỉnh sửa user thành admin!" });
            }

            // Cập nhật thông tin user
            await User.update(userId, { name, email, phone, address });

            res.status(200).json({ message: "Người dùng đã được cập nhật thành công!" });
        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error);
            res.status(500).json({ error: "Lỗi máy chủ" });
        }
    }

    async logout(req, res) {
        res.clearCookie('accessToken');
        res.json({ message: "Đăng xuất thành công" });
    }

//     async getUserProfile(req, res) {
//         try {
//             const userId = req.user.userId;
//             const user = await User.getUserById(userId);

//             if (!user) {
//                 return res.status(404).json({ error: "Người dùng không tồn tại!" });
//             }

//             if (user.role === 'admin') {
//                 res.render('admin-profile', { user });
//             } else {
//                 res.render('user-profile', { user });
//             }
            
//         } catch (error) {
//             console.error("Lỗi khi lấy thông tin người dùng:", error);
//             res.status(500).json({ error: "Lỗi máy chủ" });
//         }
//     }

}

module.exports = new UserController();
