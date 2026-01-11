// Fungsi untuk Login Admin
async function adminLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Email dan Password harus diisi');
        return;
    }

    try {
        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok && data.role === 'ADMIN') {
            // 1. Simpan token ke localStorage
            localStorage.setItem('adminToken', data.token);
            
            alert('Login Berhasil!');

            // 2. Langsung ubah tampilan (tanpa perlu pindah halaman jika sudah di admin.html)
            const loginForm = document.getElementById('loginForm');
            const adminDashboard = document.getElementById('adminDashboard');
            
            if (loginForm && adminDashboard) {
                loginForm.style.display = 'none';
                adminDashboard.style.display = 'block';
                loadUsers(); // Muat data tabel
            } else {
                // Jika login dilakukan dari halaman lain
                window.location.href = '/admin.html';
            }
        } else {
            alert(data.message || 'Login Gagal. Pastikan Anda adalah Admin.');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Terjadi kesalahan koneksi ke server.');
    }
}

// Fungsi untuk Load Data User ke Tabel
async function loadUsers() {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    const tableBody = document.getElementById('userTableBody');
    if (!tableBody) return;

    try {
        const res = await fetch('/api/admin/users', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (res.status === 401 || res.status === 403) {
            // Token tidak valid atau expired
            localStorage.removeItem('adminToken');
            window.location.reload();
            return;
        }

        const users = await res.json();
        tableBody.innerHTML = '';

        if (users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Tidak ada data client.</td></tr>';
            return;
        }

        users.forEach(u => {
            tableBody.innerHTML += `
                <tr>
                    <td>${u.id}</td>
                    <td>${u.username}</td>
                    <td>${u.email}</td>
                    <td>
                        <button onclick="deleteUser(${u.id})" style="background-color: #ff4d4d; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">Hapus</button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error('Gagal memuat user:', err);
        tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: red;">Gagal mengambil data dari server.</td></tr>';
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
            loadUsers(); // Refresh isi tabel
        } else {
            const data = await res.json();
            alert('Gagal menghapus: ' + data.message);
        }
    } catch (err) {
        console.error('Error delete:', err);
        alert('Terjadi kesalahan saat menghapus user');
    }
}