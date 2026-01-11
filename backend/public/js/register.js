async function registerClient() {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;

  const res = await fetch('/client/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email })
  });

  const data = await res.json();
  document.getElementById('output').textContent =
    JSON.stringify(data, null, 2);

  if (data.data?.apiKey) {
    localStorage.setItem('apiKey', data.data.apiKey);
  }
}
