//
const apiKey = localStorage.getItem('apiKey');
const statusDisplay = document.getElementById('status');

if (apiKey) {
  statusDisplay.innerText = 'API Key terdeteksi. Anda dapat mencari musik.';
} else {
  statusDisplay.innerText = 'Tidak ada API Key. Silakan login atau register terlebih dahulu.';
}

function goSearch() {
  if (!apiKey) {
    alert('Silakan login atau register untuk mendapatkan akses!');
    window.location.href = '/login.html';
    return;
  }
  window.location.href = '/search.html';
}