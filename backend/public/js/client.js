async function searchMusic() {
  // 1. Ambil API Key dari LocalStorage
  const apiKey = localStorage.getItem('apiKey');
  
  if (!apiKey) {
    alert('Silakan login atau register terlebih dahulu untuk mendapatkan API Key');
    window.location.href = '/login.html';
    return;
  }

  // 2. Ambil kata kunci pencarian
  const termInput = document.getElementById('term');
  const term = termInput.value.trim();

  if (!term) {
    alert('Masukkan judul lagu atau nama artis yang ingin dicari');
    return;
  }

  const list = document.getElementById('result');
  list.innerHTML = '<li>Mencari musik...</li>'; // Feedback visual loading

  try {
    // 3. Lakukan Fetch ke Backend
    const res = await fetch(`/client/music/search?term=${encodeURIComponent(term)}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Gagal mengambil data dari server');
    }

    // 4. Bersihkan daftar hasil
    list.innerHTML = '';

    // 5. Cek apakah ada hasil (iTunes API biasanya mengembalikan array langsung atau data.results)
    // Kita buat fleksibel agar bisa membaca keduanya
    const songs = data.results || data;

    if (!songs || songs.length === 0) {
      list.innerHTML = '<li>Musik tidak ditemukan.</li>';
      return;
    }

    // 6. Tampilkan lagu ke layar
    songs.forEach(song => {
      const li = document.createElement('li');
      li.className = 'song-item'; // Tambahkan class jika ada CSS-nya
      li.innerHTML = `
        <strong>${song.trackName}</strong> <br>
        <small>${song.artistName} - ${song.collectionName || ''}</small>
      `;
      list.appendChild(li);
    });

  } catch (error) {
    console.error('Search error:', error);
    list.innerHTML = `<li style="color: red;">Error: ${error.message}</li>`;
    
    // Jika error karena API Key tidak valid, arahkan ke login
    if (error.message.includes('API Key')) {
        alert('Sesi API Key berakhir atau tidak valid. Silakan login kembali.');
        localStorage.removeItem('apiKey');
        window.location.href = '/login.html';
    }
  }
}