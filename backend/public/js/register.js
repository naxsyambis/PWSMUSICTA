async function registerClient() {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/client/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();
  
  if (res.status === 201) {
    const output = document.getElementById('output');
    output.innerHTML = `
      <div style="background: #e0f2fe; padding: 10px; border-radius: 4px; margin-top: 10px;">
        <p><strong>Registrasi Berhasil!</strong></p>
        <p>API Key Anda: <code id="key">${data.data.apiKey}</code></p>
        <button onclick="copyKey()">Copy Key</button>
      </div>
      <p>Silakan <a href="/login.html">Login</a> untuk masuk.</p>
    `;
  } else {
    alert(data.message);
  }
}

function copyKey() {
  const keyText = document.getElementById('key').innerText;
  navigator.clipboard.writeText(keyText);
  alert('API Key disalin!');
}