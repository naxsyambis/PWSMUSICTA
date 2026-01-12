// backend/src/routes/admin.routes.js
const express = require('express');
const router = express.Router();

const adminAuth = require('../middlewares/adminAuth.middleware');
const adminAuthController = require('../controllers/adminAuth.controller');
const adminUserController = require('../controllers/adminUser.controller');


router.post('/login', adminAuthController.login);

router.get('/users', adminAuth, adminUserController.getAllUsers);

router.post('/users', adminAuth, adminUserController.createUser);

router.put('/users/:id', adminAuth, adminUserController.updateUser);

router.delete('/users/:id', adminAuth, adminUserController.deleteUser);

module.exports = router;