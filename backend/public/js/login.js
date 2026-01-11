async function handleLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const apiKey = document.getElementById('login_api_key').value;

  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, apiKey }) // Kirim 3 data
  });

  const result = await res.json();

  if (res.ok) {
    localStorage.setItem('token', result.token);
    localStorage.setItem('apiKey', result.apiKey);
    window.location.href = result.redirect;
  } else {
    alert("Gagal Login: " + result.message);
  }
}

// Fungsi jika lupa API Key
async function forgotApiKey() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
    alert("Masukkan Email & Password Anda terlebih dahulu untuk verifikasi.");
    return;
  }

  // Kita buat endpoint khusus atau gunakan login sementara untuk verifikasi identitas
  const res = await fetch('/client/api-key/recovery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    document.getElementById('new-key-area').style.display = 'block';
    document.getElementById('recovery-key').innerText = data.apiKey;
    alert("API Key baru berhasil di-generate!");
  } else {
    alert(data.message);
  }
}