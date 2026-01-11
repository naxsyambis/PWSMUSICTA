const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    await authService.register(username, email, password);
    res.json({ message: 'Register success' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    // Ambil data dari body
    const { email, password, apiKey } = req.body;

    // Panggil service (Service sudah kita buat untuk handle Admin tanpa API Key)
    const result = await authService.login(email, password, apiKey);
    
    return res.json(result);
  } catch (error) {
    // Jika error, kirim status 401
    return res.status(401).json({ message: error.message });
  }
};
