const apiKey = localStorage.getItem('apiKey');
const status = document.getElementById('status');

if (apiKey) {
  status.innerText = 'API Key detected. You can search music.';
} else {
  status.innerText = 'No API Key found. Please register first.';
}

function goRegister() {
  window.location.href = '/register.html';
}

function goSearch() {
  if (!apiKey) {
    alert('Register dulu!');
    return;
  }
  window.location.href = '/search.html';
}
