const apiKeyService = require('../services/apiKey.service');
const musicService = require('../services/music.service');
const userRepository = require('../repositories/user.repository'); // Tambahkan ini
const bcrypt = require('bcrypt'); // Tambahkan ini

class ClientController {
  // POST /client/register
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const result = await apiKeyService.registerUserAndGenerateKey({
        username,
        email,
        password
      });

      return res.status(201).json({
        message: 'Register success',
        data: result
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  // GET /client/music/search
  async searchMusic(req, res) {
    try {
      const { term, limit } = req.query;

      const result = await musicService.searchMusic({
        term,
        limit
      });

      return res.json(result);

    } catch (error) {
      return res.status(500).json({
        message: 'Failed to fetch music data'
      });
    }
  }

  // POST /client/api-key
  // Digunakan saat user SUDAH LOGIN (lewat Middleware)
  async generateApiKey(req, res) {
    try {
      const apiKeyData = await apiKeyService.generate(req.user.id);
      res.json({ apiKey: apiKeyData.api_key });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // POST /client/api-key/recovery
  // Digunakan saat user LUPA API KEY di halaman Login
  async recoveryApiKey(req, res) {
    try {
      const { email, password } = req.body;

      // 1. Cari user berdasarkan email
      const user = await userRepository.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      // 2. Verifikasi password menggunakan bcrypt
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Password salah" });
      }

      // 3. Generate ulang/Update API Key menggunakan service
      const newKey = await apiKeyService.generate(user.id); 
      
      return res.json({ 
        message: "API Key baru berhasil dibuat",
        apiKey: newKey.api_key 
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }
}

// Ekspor instance dari class
module.exports = new ClientController();