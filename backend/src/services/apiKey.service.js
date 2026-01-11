const crypto = require('crypto');
const userRepository = require('../repositories/user.repository');
const apiKeyRepository = require('../repositories/apiKey.repository');

class ApiKeyService {

  async registerUserAndGenerateKey({ username, email }) {
    // 1. Cek username sudah ada atau belum
    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    // 2. Buat user baru
    const user = await userRepository.createUser({
      username,
      email
    });

    // 3. Generate API Key
    const apiKeyValue = crypto.randomBytes(32).toString('hex');

    // 4. Simpan API Key
    const apiKey = await apiKeyRepository.createApiKey({
      api_key: apiKeyValue,
      user_id: user.id
    });

    // 5. Return data penting saja
    return {
      username: user.username,
      email: user.email,
      apiKey: apiKey.api_key
    };
  }

  async validateApiKey(apiKey) {
    const keyData = await apiKeyRepository.findByKey(apiKey);

    if (!keyData) {
      throw new Error('API Key not found');
    }

    if (keyData.status !== 'ACTIVE') {
      throw new Error('API Key is inactive');
    }

    return keyData;
  }
}

module.exports = new ApiKeyService();
