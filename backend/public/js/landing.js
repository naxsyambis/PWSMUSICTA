// public/js/landing.js

function handleLogout() {
    // 1. Konfirmasi ke user agar tidak tidak sengaja tertekan
    if (!confirm("Apakah Anda yakin ingin keluar?")) {
        return;
    }

    // 2. Hapus SEMUA data dari localStorage (token, adminToken, dan apiKey)
    // Menggunakan clear() lebih aman daripada removeItem satu per satu
    localStorage.clear();

    // 3. Beri notifikasi
    alert("Anda telah berhasil logout.");

    // 4. Redirect paksa ke login.html
    // Menggunakan replace agar user tidak bisa kembali ke halaman sebelumnya dengan tombol 'Back' browser
    window.location.replace('/login.html');
}

// Logika Update status teks di halaman index.html
document.addEventListener('DOMContentLoaded', () => {
    const statusElement = document.getElementById('status');
    const apiKey = localStorage.getItem('apiKey');
    const adminToken = localStorage.getItem('adminToken');

    if (statusElement) {
        if (adminToken) {
            statusElement.innerText = 'Logged in as Admin. Dashboard access granted.';
        } else if (apiKey) {
            statusElement.innerText = 'Logged in as Client. Ready to search.';
        } else {
            statusElement.innerText = 'Not logged in.';
        }
    }
});