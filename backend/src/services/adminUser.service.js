const adminUserRepo = require('../repositories/adminUser.repository');

class AdminUserService {

  async getAllUsers() {
    return adminUserRepo.findAllUsers();
  }

  async deleteUser(userId) {
    return adminUserRepo.deleteUser(userId);
  }

  async deactivateApiKey(apiKeyId) {
    return adminUserRepo.updateApiKeyStatus(apiKeyId, 'INACTIVE');
  }
}

module.exports = new AdminUserService();
