const { User } = require('../../models'); //

class UserRepository {

  async findByUsername(username) {
    return User.findOne({ where: { username } });
  }


  async findByEmail(email) {
    return User.findOne({ where: { email } });
  }


  async createUser(data) {
    return User.create(data);
  }
}

module.exports = new UserRepository();