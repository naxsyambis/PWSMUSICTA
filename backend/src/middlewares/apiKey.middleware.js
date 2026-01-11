const apiKeyService = require('../services/apiKey.service');

module.exports = async function apiKeyMiddleware(req, res, next) {
  try {
    // req.header('x-api-key') sudah benar untuk Express
    const apiKey = req.header('x-api-key');

    if (!apiKey) {
      return res.status(401).json({
        message: 'API Key is required'
      });
    }

    // Validasi via service
    const keyData = await apiKeyService.validateApiKey(apiKey);

    // Proteksi tambahan: Pastikan data user ada sebelum diakses
    if (!keyData || !keyData.user) {
      return res.status(401).json({
        message: 'API Key valid, but User data not found. Please contact admin.'
      });
    }

    // Simpan info client ke request agar bisa dipakai controller
    req.client = {
      userId: keyData.user.id,
      username: keyData.user.username
    };

    next();
  } catch (error) {
    console.error("Middleware Error:", error.message);
    return res.status(401).json({
      message: error.message || 'Invalid API Key'
    });
  }
};