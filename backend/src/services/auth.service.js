const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminRepo = require('../repositories/admin.repository');
const userRepo = require('../repositories/user.repository');

exports.register = async (username, email, password) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new Error('Email already registered');

  const hashedPassword = await bcrypt.hash(password, 10);

  await userRepo.create({
    username,
    email,
    password: hashedPassword
  });
};

exports.login = async (email, password) => {
  // cek admin
  const admin = await adminRepo.findByEmail(email);
  if (admin) {
    const match = await bcrypt.compare(password, admin.password);
    if (!match) throw new Error('Password salah');

    const token = jwt.sign(
      { id: admin.id, role: 'ADMIN' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return { token, role: 'ADMIN' };
  }

  // cek client
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error('User tidak ditemukan');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Password salah');

  const token = jwt.sign(
    { id: user.id, role: 'CLIENT' },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { token, role: 'CLIENT' };
};
