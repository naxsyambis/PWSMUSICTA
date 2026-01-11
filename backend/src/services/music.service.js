const axios = require('axios');

class MusicService {

  async searchMusic({ term = 'music', limit = 20 }) {
    const response = await axios.get(
      `${process.env.ITUNES_BASE_URL}/search`,
      {
        params: {
          term,
          entity: 'song',
          limit
        }
      }
    );

    return response.data;
  }
}

module.exports = new MusicService();
