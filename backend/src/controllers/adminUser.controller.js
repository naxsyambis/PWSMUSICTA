const adminUserService = require('../services/adminUser.service');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await adminUserService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await adminUserService.deleteUser(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await adminUserService.updateUser(req.params.id, req.body);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};