//
async function handleLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await res.json();

    if (res.ok) {
      // Simpan token JWT jika diperlukan untuk akses Admin
      if (result.token) {
        localStorage.setItem('token', result.token);
      }

      // Cek Role
      if (result.role === 'ADMIN') {
        alert('Login berhasil sebagai Admin');
        window.location.href = '/admin.html'; // Arahkan ke Dashboard Admin
      } else if (result.role === 'CLIENT') {
        // Simpan API Key khusus untuk Client agar bisa mencari musik
        if (result.apiKey) {
          localStorage.setItem('apiKey', result.apiKey);
        }
        alert('Login berhasil sebagai Client');
        window.location.href = '/index.html'; // Arahkan ke halaman pencarian musik
      }
    } else {
      alert('Login Gagal: ' + (result.message || 'Email atau password salah'));
    }
  } catch (error) {
    console.error('Error saat login:', error);
    alert('Terjadi kesalahan pada server.');
  }
}