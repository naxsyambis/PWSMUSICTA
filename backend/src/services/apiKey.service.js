const crypto = require('crypto');
const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');
const apiKeyRepository = require('../repositories/apiKey.repository');

class ApiKeyService {
  /**
   * Mendaftarkan user baru dan membuatkan API Key pertama kali
   */
  async registerUserAndGenerateKey({ username, email, password }) {
    // 1. Cek email/username sudah ada atau belum
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) throw new Error('Email already registered');

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Buat user baru
    const user = await userRepository.createUser({
      username,
      email,
      password: hashedPassword
    });

    // 4. Generate API Key
    const apiKeyValue = crypto.randomBytes(32).toString('hex');

    // 5. Simpan API Key
    const apiKey = await apiKeyRepository.createApiKey({
      api_key: apiKeyValue,
      user_id: user.id
    });

    return {
      username: user.username,
      email: user.email,
      apiKey: apiKey.api_key
    };
  }

  /**
   * Menghasilkan API Key baru (untuk fitur recovery/lupa key)
   * Jika sudah ada, akan di-update. Jika belum, akan dibuat baru.
   */
  async generate(userId) {
    const apiKeyValue = crypto.randomBytes(32).toString('hex');
    
    // Cari apakah user sudah memiliki API Key di database
    const existingKey = await apiKeyRepository.findByUserId(userId);
    
    if (existingKey) {
      // Jika ada, update nilai key-nya dan pastikan status ACTIVE
      existingKey.api_key = apiKeyValue;
      existingKey.status = 'ACTIVE';
      await existingKey.save(); // Simpan perubahan ke database
      return existingKey;
    } else {
      // Jika belum ada, buat record baru
      return await apiKeyRepository.createApiKey({
        api_key: apiKeyValue,
        user_id: userId,
        status: 'ACTIVE'
      });
    }
  }

  /**
   * Validasi API Key saat digunakan untuk mengakses resource musik
   */
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