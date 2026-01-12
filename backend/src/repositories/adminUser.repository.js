const { User, ApiKey } = require('../../models');

class AdminUserRepository {

  async findAllUsers() {
    return User.findAll({
      include: ['apiKey'],
      attributes: { exclude: ['password'] } // Opsional: Menyembunyikan password demi keamanan
    });
  }


  async createUser(userData) {
    return User.create(userData);
  }


  async updateUser(id, updateData) {
    return User.update(updateData, { 
      where: { id } 
    });
  }

  async deleteUser(id) {
    return User.destroy({ 
      where: { id } 
    });
  }

  async updateApiKeyStatus(id, status) {
    return ApiKey.update(
      { status },
      { where: { id } }
    );
  }
}

module.exports = new AdminUserRepository();