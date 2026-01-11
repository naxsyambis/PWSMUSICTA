async function adminLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok && data.role === 'ADMIN') {
            // 1. Simpan token
            localStorage.setItem('adminToken', data.token);
            
            // 2. LANGSUNG SEMBUNYIKAN LOGIN DAN MUNCULKAN DASHBOARD
            // Ini kunci agar Anda tidak perlu input email/pass lagi
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';

            // 3. Muat data tabel client
            loadUsers(); 
            
            alert('Login Berhasil!');
        } else {
            alert(data.message || 'Login Gagal! Pastikan akun adalah Admin.');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Gagal terhubung ke server');
    }
}

async function loadUsers() {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
        const res = await fetch('/api/admin/users', {
            headers: { 'Authorization': 'Bearer ' + token }
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
                        <button onclick="deleteUser(${u.id})" style="background:red; color:white; border:none; padding:5px; cursor:pointer;">Hapus</button>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error('Gagal memuat user:', err);
    }
}

// Fungsi Hapus
async function deleteUser(id) {
    if (!confirm('Hapus user ini?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
    });
    loadUsers();
}