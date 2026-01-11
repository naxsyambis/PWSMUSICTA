const { User } = require('../../models'); //

class UserRepository {
  // Fungsi mencari user berdasarkan username
  async findByUsername(username) {
    return User.findOne({ where: { username } });
  }

  // Fungsi mencari user berdasarkan email
  async findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  // Fungsi menyimpan user baru ke database
  async createUser(data) {
    return User.create(data);
  }
}

module.exports = new UserRepository();