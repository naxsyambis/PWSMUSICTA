const apiKeyService = require('../services/apiKey.service');
const musicService = require('../services/music.service');

class ClientController {

  // POST /client/register
  async register(req, res) {
    try {
      const { username, email } = req.body;

      if (!username || !email) {
        return res.status(400).json({
          message: 'username and email are required'
        });
      }

      const result = await apiKeyService.registerUserAndGenerateKey({
        username,
        email
      });

      return res.status(201).json({
        message: 'Register success',
        data: result
      });

    } catch (error) {
      return res.status(400).json({
        message: error.message
      });
    }
  }

  // GET /music/search
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
}

exports.generateApiKey = async (req, res) => {
  try {
    const apiKey = await apiKeyService.generate(req.user.id);
    res.json({ apiKey });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


module.exports = new ClientController();
