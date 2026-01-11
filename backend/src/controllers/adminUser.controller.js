const adminUserService = require('../services/adminUser.service');

class AdminUserController {

  async getUsers(req, res) {
    const users = await adminUserService.getAllUsers();
    res.json(users);
  }

  async deleteUser(req, res) {
    await adminUserService.deleteUser(req.params.id);
    res.json({ message: 'User deleted' });
  }

  async deactivateKey(req, res) {
    await adminUserService.deactivateApiKey(req.params.id);
    res.json({ message: 'API Key deactivated' });
  }
}

module.exports = new AdminUserController();
