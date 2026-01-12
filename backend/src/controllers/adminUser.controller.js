const adminUserService = require('../services/adminUser.service');


exports.getAllUsers = async (req, res) => {
    try {
        const users = await adminUserService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.createUser = async (req, res) => {
    try {
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
        
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Email sudah terdaftar." });
        }
        res.status(500).json({ message: error.message });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const result = await adminUserService.updateUser(req.params.id, req.body);
        
        if (result[0] === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan atau tidak ada perubahan data.' });
        }
        
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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