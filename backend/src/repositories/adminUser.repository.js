const { User, ApiKey } = require('../../models');

class AdminUserRepository {
  /**
   * Mengambil semua user beserta data API Key mereka
   */
  async findAllUsers() {
    return User.findAll({
      include: ['apiKey'],
      attributes: { exclude: ['password'] } // Opsional: Menyembunyikan password demi keamanan
    });
  }

  /**
   * FITUR TAMBAH: Menyimpan user baru ke database
   */
  async createUser(userData) {
    return User.create(userData);
  }

  /**
   * FITUR EDIT: Mengupdate data user berdasarkan ID
   */
  async updateUser(id, updateData) {
    return User.update(updateData, { 
      where: { id } 
    });
  }

  /**
   * Menghapus user berdasarkan ID
   */
  async deleteUser(id) {
    return User.destroy({ 
      where: { id } 
    });
  }

  /**
   * Update status API Key (Aktif/Nonaktif)
   */
  async updateApiKeyStatus(id, status) {
    return ApiKey.update(
      { status },
      { where: { id } }
    );
  }
}

module.exports = new AdminUserRepository();