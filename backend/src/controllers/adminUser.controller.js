// backend/src/controllers/adminUser.controller.js
const adminUserService = require('../services/adminUser.service');

// Mendapatkan semua data user
exports.getAllUsers = async (req, res) => {
    try {
        const users = await adminUserService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// FITUR TAMBAH: Membuat user baru
exports.createUser = async (req, res) => {
    try {
        // Validasi input minimal
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Username, Email, dan Password wajib diisi." });
        }

        const user = await adminUserService.createUser(req.body);
        res.status(201).json({ 
            message: "User berhasil dibuat", 
            user: { id: user.id, username: user.username, email: user.email } 
        });
    } catch (error) {
        // Menangani error jika email duplikat (unik)
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Email sudah terdaftar." });
        }
        res.status(500).json({ message: error.message });
    }
};

// FITUR EDIT: Memperbarui data user
exports.updateUser = async (req, res) => {
    try {
        const result = await adminUserService.updateUser(req.params.id, req.body);
        
        // Cek apakah ada baris yang berubah
        if (result[0] === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan atau tidak ada perubahan data.' });
        }
        
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Menghapus user
exports.deleteUser = async (req, res) => {
    try {
        const result = await adminUserService.deleteUser(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};