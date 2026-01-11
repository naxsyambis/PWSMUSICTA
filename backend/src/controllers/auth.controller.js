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
  const { email, password } = req.body;

  try {
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
