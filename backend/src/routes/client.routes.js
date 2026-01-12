const express = require('express');
const router = express.Router();

const clientController = require('../controllers/client.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const apiKeyMiddleware = require('../middlewares/apiKey.middleware');

router.post('/register', clientController.register);

router.post('/api-key/recovery', clientController.recoveryApiKey);

router.post('/api-key', authMiddleware, clientController.generateApiKey);

router.get('/music/search', apiKeyMiddleware, clientController.searchMusic);

module.exports = router;