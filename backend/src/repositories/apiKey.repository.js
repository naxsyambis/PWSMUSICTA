const { ApiKey, User } = require('../../models');

class ApiKeyRepository {

  async createApiKey(data) {
    return ApiKey.create(data);
  }

  async findByKey(apiKey) {
    return ApiKey.findOne({
      where: { api_key: apiKey },
      include: ['user']
    });
  }

  async findByUserId(userId) {
    return ApiKey.findOne({
      where: { user_id: userId }
    });
  }

  async updateStatus(id, status) {
    return ApiKey.update(
      { status },
      { where: { id } }
    );
  }

  async deleteByUserId(userId) {
    return ApiKey.destroy({
      where: { user_id: userId }
    });
  }
}

module.exports = new ApiKeyRepository();
