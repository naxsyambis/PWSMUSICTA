// Fungsi untuk Login Admin
async function adminLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/auth/login', { // Sesuaikan dengan route auth
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            // Simpan token ke localStorage agar tidak hilang saat refresh
            localStorage.setItem('adminToken', data.token);
            alert('Login Berhasil!');
            window.location.href = '/admin.html'; // Pindah ke dashboard
        } else {
            alert(data.message || 'Login Gagal');
        }
    } catch (err) {
        console.error('Error:', err);
    }
}

// Fungsi untuk Load Data User ke Tabel
async function loadUsers() {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
        const res = await fetch('/api/admin/users', { // Sesuai dengan app.use('/api/admin', ...)
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const users = await res.json();
        const tableBody = document.getElementById('userTableBody');
        
        if (!tableBody) return;
        tableBody.innerHTML = '';

        users.forEach(u => {
            tableBody.innerHTML += `
                <tr>
                    <td>${u.id}</td>
                    <td>${u.username}</td>
                    <td>${u.email}</td>
                    <td>
                        <button onclick="deleteUser(${u.id})" style="background-color: red; color: white;">Hapus</button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error('Gagal memuat user:', err);
    }
}

// Fungsi Hapus User
async function deleteUser(id) {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
        const res = await fetch(`/api/admin/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (res.ok) {
            alert('User berhasil dihapus');
            loadUsers(); // Refresh tabel
        }
    } catch (err) {
        alert('Gagal menghapus user');
    }
}

// Jalankan loadUsers otomatis saat halaman admin.html terbuka
if (window.location.pathname.includes('admin.html')) {
    document.addEventListener('DOMContentLoaded', loadUsers);
}