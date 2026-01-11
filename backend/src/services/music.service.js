const axios = require('axios');

class MusicService {
  async searchMusic({ term = 'music', limit = 20 }) {
    try {
      // Menggunakan BASE_URL dari .env, jika tidak ada pakai default iTunes API
      const baseUrl = process.env.ITUNES_BASE_URL || 'https://itunes.apple.com';
      
      const response = await axios.get(`${baseUrl}/search`, {
        params: {
          term: term,
          entity: 'song',
          limit: limit
        },
        // Timeout 5 detik agar tidak menunggu terlalu lama jika koneksi lambat
        timeout: 5000 
      });

      // Mengembalikan seluruh object data 
      // Karena di client.js Anda memanggil data.results
      return response.data;

    } catch (error) {
      console.error('Error fetching from iTunes API:', error.message);
      
      // Melempar error agar ditangkap oleh Controller
      throw new Error('Gagal mengambil data musik dari API publik');
    }
  }
}

module.exports = new MusicService();