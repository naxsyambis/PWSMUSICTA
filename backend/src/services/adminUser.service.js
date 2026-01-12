const adminUserRepo = require('../repositories/adminUser.repository');
const bcrypt = require('bcrypt');

class AdminUserService {

  async getAllUsers() {
    return adminUserRepo.findAllUsers();
  }

  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      ...userData,
      password: hashedPassword
    };
    return adminUserRepo.createUser(newUser);
  }

  async updateUser(userId, updateData) {

    if (updateData.password && updateData.password.trim() !== "") {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {

      delete updateData.password;
    }
    return adminUserRepo.updateUser(userId, updateData);
  }

  async deleteUser(userId) {
    return adminUserRepo.deleteUser(userId);
  }

  async deactivateApiKey(apiKeyId) {
    return adminUserRepo.updateApiKeyStatus(apiKeyId, 'INACTIVE');
  }
}

module.exports = new AdminUserService();