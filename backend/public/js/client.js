// public/js/client.js

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
    
    // Feedback visual loading dengan desain modern
    list.innerHTML = `
        <li class="text-center py-12">
            <div class="animate-spin inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mb-4"></div>
            <p class="text-gray-400 italic">Mencari melodi untukmu...</p>
        </li>
    `;

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

        // 5. Ambil hasil (iTunes mengembalikan 'results' atau array langsung)
        const songs = data.results || data;

        if (!songs || !Array.isArray(songs) || songs.length === 0) {
            list.innerHTML = `
                <li class="text-center py-20 text-gray-400 bg-white/50 rounded-3xl border-2 border-dashed border-orange-50">
                    <div class="text-4xl mb-2">🤔</div>
                    Musik tidak ditemukan. Coba kata kunci lain.
                </li>
            `;
            return;
        }

        // 6. Tampilkan lagu ke layar dengan desain KARTU MODERN
        songs.forEach(song => {
            const li = document.createElement('li');
            
            // Styling kartu lagu yang fleksibel dan rapi
            li.className = 'song-card bg-white p-4 rounded-2xl flex items-center gap-4 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300';
            
            li.innerHTML = `
                <div class="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 shrink-0 shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                    </svg>
                </div>
                
                <div class="flex-1 min-w-0">
                    <p class="font-bold text-[#433422] truncate text-lg mb-0.5">${song.trackName || 'Unknown Track'}</p>
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-semibold text-orange-600 truncate">${song.artistName || 'Unknown Artist'}</span>
                        <span class="text-[10px] text-gray-300">•</span>
                        <span class="text-xs text-gray-400 truncate">${song.collectionName || 'Single'}</span>
                    </div>
                </div>
                
                <div class="text-orange-200 group-hover:text-orange-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            `;

            // Opsional: Tambahkan fungsi klik untuk info lebih lanjut
            li.onclick = () => {
                console.log('Playing/Info for:', song.trackName);
                // Di sini Anda bisa menambahkan fungsi play musik jika ada URL preview-nya
            };

            list.appendChild(li);
        });

    } catch (error) {
        console.error('Search error:', error);
        
        // Tampilan Error yang lebih manis
        list.innerHTML = `
            <li class="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 text-center">
                <p class="font-bold">Ups! Terjadi Kesalahan</p>
                <p class="text-xs">${error.message}</p>
            </li>
        `;
        
        // Jika error karena API Key tidak valid, arahkan ke login
        if (error.message.includes('API Key') || error.message.includes('authorized')) {
            setTimeout(() => {
                alert('Sesi API Key berakhir atau tidak valid. Silakan login kembali.');
                localStorage.removeItem('apiKey');
                window.location.href = '/login.html';
            }, 1000);
        }
    }
}

// Tambahkan listener untuk menekan tombol "Enter" di kolom pencarian
document.getElementById('term')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchMusic();
    }
});