//
async function registerClient() {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value; // Ambil nilai password

  const res = await fetch('/client/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }) // Kirim password ke server
  });

  const data = await res.json();
  document.getElementById('output').textContent = JSON.stringify(data, null, 2);

  // Jika berhasil, simpan API Key ke localStorage
  if (data.data && data.data.apiKey) {
    localStorage.setItem('apiKey', data.data.apiKey);
    alert('Registrasi berhasil! API Key telah disimpan.');
    window.location.href = '/index.html'; // Arahkan ke halaman utama
  } else if (data.message) {
    alert('Registrasi Gagal: ' + data.message);
  }
}