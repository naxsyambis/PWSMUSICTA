function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('apiKey');
  window.location.href = '/login.html';
}

// Update status teks
const apiKey = localStorage.getItem('apiKey');
if (apiKey) {
  document.getElementById('status').innerText = 'Logged in as Client. Ready to search.';
}