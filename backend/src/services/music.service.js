const axios = require('axios');

class MusicService {
  async searchMusic({ term = 'music', limit = 20 }) {
    try {

      const baseUrl = process.env.ITUNES_BASE_URL || 'https://itunes.apple.com';
      
      const response = await axios.get(`${baseUrl}/search`, {
        params: {
          term: term,
          entity: 'song',
          limit: limit
        },

        timeout: 5000 
      });


      return response.data;

    } catch (error) {
      console.error('Error fetching from iTunes API:', error.message);
      
      throw new Error('Gagal mengambil data musik dari API publik');
    }
  }
}

module.exports = new MusicService();