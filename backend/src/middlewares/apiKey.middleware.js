const apiKeyService = require('../services/apiKey.service');

module.exports = async function apiKeyMiddleware(req, res, next) {
  try {
    const apiKey = req.header('x-api-key');

    if (!apiKey) {
      return res.status(401).json({
        message: 'API Key is required'
      });
    }

    // Validasi via service (business logic)
    const keyData = await apiKeyService.validateApiKey(apiKey);

    // Simpan info client ke request (untuk dipakai controller)
    req.client = {
      userId: keyData.user.id,
      username: keyData.user.username
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: error.message || 'Invalid API Key'
    });
  }
};
