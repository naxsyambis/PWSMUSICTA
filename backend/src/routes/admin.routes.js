// backend/src/routes/admin.routes.js
const express = require('express');
const router = express.Router();

const adminAuth = require('../middlewares/adminAuth.middleware');
const adminAuthController = require('../controllers/adminAuth.controller');
const adminUserController = require('../controllers/adminUser.controller');

/**
 * ROUTES KHUSUS ADMIN
 */

// 1. Login Admin (Public di rute admin)
router.post('/login', adminAuthController.login);

// 2. CRUD Users (Semua dilindungi oleh adminAuth)
// Mengambil semua user
router.get('/users', adminAuth, adminUserController.getAllUsers);

// Tambah user baru
router.post('/users', adminAuth, adminUserController.createUser);

// Edit user (berdasarkan ID)
router.put('/users/:id', adminAuth, adminUserController.updateUser);

// Hapus user (berdasarkan ID)
router.delete('/users/:id', adminAuth, adminUserController.deleteUser);

module.exports = router;