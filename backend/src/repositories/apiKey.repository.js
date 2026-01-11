const { ApiKey, User } = require('../../models');

class ApiKeyRepository {
  // Simpan key baru ke database
  async createApiKey(data) {
    return ApiKey.create(data);
  }

  // Cari berdasarkan string API Key
  async findByKey(apiKey) {
    return ApiKey.findOne({
      where: { api_key: apiKey },
      include: [{ model: User, as: 'user' }] // Pastikan alias sesuai dengan model ApiKey.js
    });
  }

  // Cari berdasarkan ID User (PENTING: Ini yang menyebabkan error tadi)
  async findByUserId(userId) {
    return ApiKey.findOne({
      where: { user_id: userId }
    });
  }

  // Update status (ACTIVE/INACTIVE)
  async updateStatus(id, status) {
    return ApiKey.update(
      { status },
      { where: { id } }
    );
  }

  // Hapus key berdasarkan user id
  async deleteByUserId(userId) {
    return ApiKey.destroy({
      where: { user_id: userId }
    });
  }
}

module.exports = new ApiKeyRepository();