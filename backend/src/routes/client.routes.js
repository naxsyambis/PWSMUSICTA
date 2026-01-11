const express = require('express');
const router = express.Router();

const clientController = require('../controllers/client.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const apiKeyMiddleware = require('../middlewares/apiKey.middleware');

// Register user + generate API key
router.post('/register', clientController.register);
router.post('/api-key', authMiddleware, clientController.generateApiKey);

// Search music (protected by API Key)
router.post(
  '/api-key',
  authMiddleware,
  clientController.generateApiKey
);

module.exports = router;
