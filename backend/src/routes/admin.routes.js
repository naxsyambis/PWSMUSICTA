const express = require('express');
const router = express.Router();

const adminAuth = require('../middlewares/adminAuth.middleware');
const adminAuthController = require('../controllers/adminAuth.controller');
const adminUserController = require('../controllers/adminUser.controller');

// Login khusus admin (jika menggunakan endpoint /api/admin/login)
router.post('/login', adminAuthController.login);

// CRUD Users
// Pastikan nama fungsi di belakang (misal: getAllUsers) sama dengan yang ada di controller
router.get('/users', adminAuth, adminUserController.getAllUsers);
router.delete('/users/:id', adminAuth, adminUserController.deleteUser);
router.put('/users/:id', adminAuth, adminUserController.updateUser);

module.exports = router;