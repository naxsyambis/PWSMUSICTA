async function handleLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const apiKey = document.getElementById('login_api_key').value;

  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, apiKey })
  });

  const result = await res.json();
  if (res.ok) {
    localStorage.setItem('token', result.token);
    localStorage.setItem('apiKey', result.apiKey);
    window.location.href = result.redirect;
  } else {
    alert(result.message);
  }
}

async function forgotApiKey() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!email || !password) {
    alert("Silakan isi Email dan Password terlebih dahulu untuk verifikasi identitas.");
    return;
  }

  const res = await fetch('/client/api-key/recovery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    document.getElementById('recovery-area').style.display = 'block';
    document.getElementById('new-key-display').innerText = data.apiKey;
  } else {
    alert(data.message);
  }
}

function copyAndFill() {
  const key = document.getElementById('new-key-display').innerText;
  document.getElementById('login_api_key').value = key;
  navigator.clipboard.writeText(key);
  alert("API Key berhasil disalin!");
}