function handleLogout() {
    if (!confirm("Apakah Anda yakin ingin keluar?")) {
        return;
    }

    localStorage.clear();

    alert("Anda telah berhasil logout.");

    window.location.replace('/login.html');
}

document.addEventListener('DOMContentLoaded', () => {
    const statusElement = document.getElementById('status');
    const apiKey = localStorage.getItem('apiKey');
    const adminToken = localStorage.getItem('adminToken');

    if (statusElement) {
        if (adminToken) {
            statusElement.innerText = 'Logged in as Admin. Dashboard access granted.';
        } else if (apiKey) {
            statusElement.innerText = 'Logged in as Client. Ready to search.';
        } else {
            statusElement.innerText = 'Not logged in.';
        }
    }
});