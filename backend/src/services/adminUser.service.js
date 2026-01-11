const adminUserRepo = require('../repositories/adminUser.repository');
const bcrypt = require('bcrypt');

class AdminUserService {

  async getAllUsers() {
    return adminUserRepo.findAllUsers();
  }

  // --- FITUR TAMBAH ---
  async createUser(userData) {
    // Hash password sebelum disimpan ke database
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      ...userData,
      password: hashedPassword
    };
    return adminUserRepo.createUser(newUser);
  }

  // --- FITUR EDIT ---
  async updateUser(userId, updateData) {
    // Jika password diisi dan tidak kosong, hash password baru tersebut
    if (updateData.password && updateData.password.trim() !== "") {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      // PENTING: Jika password kosong, hapus dari object agar tidak menimpa password lama
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