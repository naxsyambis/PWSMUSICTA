const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminRepo = require('../repositories/admin.repository');
const userRepo = require('../repositories/user.repository');
const apiKeyRepo = require('../repositories/apiKey.repository');

exports.login = async (email, password, clientApiKey) => {
  // 1. Bersihkan input dari spasi yang tidak sengaja terketik
  const cleanEmail = email ? email.trim() : "";
  const cleanPassword = password ? password.trim() : "";

  console.log(`Mencoba login untuk: ${cleanEmail}`);

  // 2. CEK ADMIN
  const admin = await adminRepo.findByEmail(cleanEmail);
  if (admin) {
    console.log("Email ditemukan di tabel Admin, mengecek password...");
    
    // Bandingkan teks biasa (cleanPassword) dengan yang ada di DB
    // Kita cek pakai bcrypt DAN cek pakai teks biasa (===) supaya pasti tembus
    const isMatchBcrypt = await bcrypt.compare(cleanPassword, admin.password).catch(() => false);
    const isMatchPlain = (cleanPassword === admin.password.trim());

    if (isMatchBcrypt || isMatchPlain) {
      console.log("Password Admin cocok! Membuat token...");
      
      // Gunakan fallback jika JWT_SECRET di .env kosong
      const secret = process.env.JWT_SECRET || 'rahasia_admin_123';
      
      const token = jwt.sign(
        { id: admin.id, role: 'ADMIN' },
        secret,
        { expiresIn: '1d' }
      );
      return { token, role: 'ADMIN', redirect: '/admin.html' };
    } else {
      console.log("Password Admin TIDAK cocok.");
      throw new Error('Password Admin salah');
    }
  }

  // 3. CEK CLIENT (Jika bukan admin)
  const user = await userRepo.findByEmail(cleanEmail);
  if (!user) {
    console.log("Email tidak ditemukan.");
    throw new Error('Email tidak terdaftar');
  }

  const userMatch = await bcrypt.compare(cleanPassword, user.password).catch(() => false);
  if (!userMatch) throw new Error('Password salah');

  if (!clientApiKey) throw new Error('API Key wajib diisi untuk Client');

  const storedKey = await apiKeyRepo.findByUserId(user.id);
  if (!storedKey || storedKey.api_key !== clientApiKey) {
    throw new Error('API Key tidak cocok');
  }

  const token = jwt.sign(
    { id: user.id, role: 'CLIENT' },
    process.env.JWT_SECRET || 'rahasia_admin_123',
    { expiresIn: '1d' }
  );

  return { 
    token, 
    role: 'CLIENT', 
    apiKey: storedKey.api_key,
    redirect: '/index.html' 
  };
};