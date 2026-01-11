const adminAuthService = require('../services/adminAuth.service');

class AdminAuthController {

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const token = await adminAuthService.login(email, password);

      res.json({ token });
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  }
}

module.exports = new AdminAuthController();
