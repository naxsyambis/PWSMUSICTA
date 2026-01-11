async function handleLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const result = await res.json();

  if (res.ok) {
    localStorage.setItem('token', result.token);
    if (result.role === 'ADMIN') {
      window.location.href = '/admin.html';
    } else {
      // Simpan API Key untuk client agar bisa search musik
      localStorage.setItem('apiKey', result.apiKey);
      window.location.href = '/index.html';
    }
  } else {
    alert(result.message);
  }
}