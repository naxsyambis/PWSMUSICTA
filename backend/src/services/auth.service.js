const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminRepo = require('../repositories/admin.repository');
const userRepo = require('../repositories/user.repository');
const apiKeyRepo = require('../repositories/apiKey.repository');

exports.login = async (email, password, clientApiKey) => {
  console.log(`Mencoba login untuk: ${email}`);

  // 1. CEK ADMIN
  const admin = await adminRepo.findByEmail(email);
  if (admin) {
    console.log("Email ditemukan di tabel Admin, mengecek password...");
    const isMatch = await bcrypt.compare(password, admin.password);
    
    if (isMatch) {
      console.log("Password Admin cocok! Membuat token...");
      const token = jwt.sign(
        { id: admin.id, role: 'ADMIN' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
      return { token, role: 'ADMIN', redirect: '/admin.html' };
    } else {
      console.log("Password Admin TIDAK cocok.");
      // Jika password admin salah, kita tidak lanjut ke user demi keamanan
      throw new Error('Password Admin salah');
    }
  }

  // 2. CEK CLIENT (Hanya jika bukan Admin)
  const user = await userRepo.findByEmail(email);
  if (!user) {
    console.log("Email tidak ditemukan di tabel Admin maupun User.");
    throw new Error('Email tidak terdaftar');
  }

  const userMatch = await bcrypt.compare(password, user.password);
  if (!userMatch) throw new Error('Password salah');

  // Validasi API Key wajib untuk Client
  if (!clientApiKey) throw new Error('API Key wajib diisi untuk Client');

  const storedKey = await apiKeyRepo.findByUserId(user.id);
  if (!storedKey || storedKey.api_key !== clientApiKey) {
    throw new Error('API Key tidak cocok');
  }

  const token = jwt.sign(
    { id: user.id, role: 'CLIENT' },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { 
    token, 
    role: 'CLIENT', 
    apiKey: storedKey.api_key,
    redirect: '/index.html' 
  };
};