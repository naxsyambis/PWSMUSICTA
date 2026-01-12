const crypto = require('crypto');
const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');
const apiKeyRepository = require('../repositories/apiKey.repository');

class ApiKeyService {
  async registerUserAndGenerateKey({ username, email, password }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) throw new Error('Email already registered');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.createUser({
      username,
      email,
      password: hashedPassword
    });

    const apiKeyValue = crypto.randomBytes(32).toString('hex');

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


  async generate(userId) {
    const apiKeyValue = crypto.randomBytes(32).toString('hex');
    

    const existingKey = await apiKeyRepository.findByUserId(userId);
    
    if (existingKey) {
      existingKey.api_key = apiKeyValue;
      existingKey.status = 'ACTIVE';
      await existingKey.save(); 
      return existingKey;
    } else {
      return await apiKeyRepository.createApiKey({
        api_key: apiKeyValue,
        user_id: userId,
        status: 'ACTIVE'
      });
    }
  }


  async validateApiKey(apiKey) {
    const keyData = await apiKeyRepository.findByKey(apiKey);
    if (!keyData) throw new Error('API Key not found');
    if (keyData.status !== 'ACTIVE') throw new Error('API Key is inactive');
    return keyData;
  }
}

module.exports = new ApiKeyService();