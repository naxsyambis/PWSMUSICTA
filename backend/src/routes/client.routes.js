const express = require('express');
const router = express.Router();

const clientController = require('../controllers/client.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const apiKeyMiddleware = require('../middlewares/apiKey.middleware');

// 1. Registrasi Akun Baru (Public)
// Menghasilkan API Key pertama kali
router.post('/register', clientController.register);

// 2. Pemulihan API Key (Public)
// Digunakan di halaman Login jika user lupa API Key
router.post('/api-key/recovery', clientController.recoveryApiKey);

// 3. Generate/Reset API Key Baru (Protected - Butuh Login JWT)
// Digunakan jika user ingin mengganti key saat sudah berada di dalam aplikasi
router.post('/api-key', authMiddleware, clientController.generateApiKey);

// 4. Pencarian Musik (Protected - Butuh API Key)
// Digunakan oleh Client untuk mencari data lagu
router.get('/music/search', apiKeyMiddleware, clientController.searchMusic);

module.exports = router;