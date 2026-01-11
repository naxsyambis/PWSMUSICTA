const { User, ApiKey } = require('../../models');

class AdminUserRepository {
  async findAllUsers() {
    return User.findAll({
      include: ['apiKey']
    });
  }

  async deleteUser(id) {
    return User.destroy({ where: { id } });
  }

  async updateApiKeyStatus(id, status) {
    return ApiKey.update(
      { status },
      { where: { id } }
    );
  }
}

module.exports = new AdminUserRepository();
