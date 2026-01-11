const express = require('express');
const router = express.Router();

const adminAuth = require('../middlewares/adminAuth.middleware');
const authController = require('../controllers/adminAuth.controller');
const userController = require('../controllers/adminUser.controller');

// Login admin
router.post('/login', authController.login);

// Protected routes
router.get('/users', adminAuth, userController.getUsers);
router.delete('/users/:id', adminAuth, userController.deleteUser);
router.put('/apikey/:id/deactivate', adminAuth, userController.deactivateKey);

module.exports = router;
