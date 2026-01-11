const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminRepo = require('../repositories/admin.repository');
const userRepo = require('../repositories/user.repository');
const apiKeyRepo = require('../repositories/apiKey.repository');

exports.login = async (email, password, clientApiKey) => {
  // 1. Cek di tabel Admin (Admin login tanpa API Key)
  const admin = await adminRepo.findByEmail(email);
  if (admin) {
    const match = await bcrypt.compare(password, admin.password);
    if (match) {
      const token = jwt.sign({ id: admin.id, role: 'ADMIN' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return { token, role: 'ADMIN', redirect: '/admin.html' };
    }
  }

  // 2. Cek di tabel Users (Client)
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error('User tidak ditemukan');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Password salah');

  // VALIDASI API KEY UNTUK CLIENT
  if (!clientApiKey) throw new Error('API Key wajib diisi untuk Client');

  const storedApiKey = await apiKeyRepo.findByUserId(user.id);
  if (!storedApiKey || storedApiKey.api_key !== clientApiKey) {
    throw new Error('API Key tidak valid atau tidak cocok');
  }

  const token = jwt.sign({ id: user.id, role: 'CLIENT' }, process.env.JWT_SECRET, { expiresIn: '1d' });

  return { 
    token, 
    role: 'CLIENT', 
    apiKey: storedApiKey.api_key,
    redirect: '/index.html' 
  };
};