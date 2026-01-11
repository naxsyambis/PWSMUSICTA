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
    const { email, password, apiKey } = req.body;
    const result = await authService.login(email, password, apiKey);
    return res.json(result);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};