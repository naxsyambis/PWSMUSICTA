const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminRepo = require('../repositories/admin.repository');

class AdminAuthService {

  async login(email, password) {
    const admin = await adminRepo.findByEmail(email);
    if (!admin) throw new Error('Admin not found');

    const match = await bcrypt.compare(password, admin.password);
    if (!match) throw new Error('Invalid password');

    return jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
  }
}

module.exports = new AdminAuthService();
