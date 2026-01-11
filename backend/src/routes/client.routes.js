const express = require('express');
const router = express.Router();

const clientController = require('../controllers/client.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const apiKeyMiddleware = require('../middlewares/apiKey.middleware');

// Register user + generate API key (Public)
router.post('/register', clientController.register);

// Generate/Reset API key (Protected by JWT)
router.post('/api-key', authMiddleware, clientController.generateApiKey);

// Search music (Protected by API Key Middleware)
// Pastikan menggunakan rute GET sesuai dengan fetch di client.js
router.get('/music/search', apiKeyMiddleware, clientController.searchMusic);

module.exports = router;