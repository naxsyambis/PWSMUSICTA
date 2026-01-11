const apiKeyService = require('../services/apiKey.service');
const musicService = require('../services/music.service');

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

  // POST /client/api-key (Pindahkan ke dalam Class agar konsisten)
  async generateApiKey(req, res) {
    try {
      // Pastikan service apiKeyService memiliki fungsi generate
      const apiKey = await apiKeyService.generate(req.user.id);
      res.json({ apiKey });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

async recoveryApiKey(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userRepo.findByEmail(email);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Password salah" });

    // Generate ulang menggunakan service yang sudah ada
    const newKey = await apiKeyService.generate(user.id); 
    return res.json({ apiKey: newKey.api_key });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

}



// Ekspor instance dari class
module.exports = new ClientController();