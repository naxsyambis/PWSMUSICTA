// public/js/admin.js

// 1. Fungsi Login Admin (Tetap dipertahankan untuk keamanan di admin.html)
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
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('token', data.token); // Konsistensi token utama

            // Sembunyikan form login, munculkan dashboard
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';

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

// 2. Fungsi Load Data (Read) - Menampilkan tombol Edit dan Hapus
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
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${u.id}</td>
                <td>${u.username}</td>
                <td>${u.email}</td>
                <td>
                    <button onclick="prepareEdit(${u.id}, '${u.username}', '${u.email}')" style="background:#ffc107; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">Edit</button>
                    <button onclick="deleteUser(${u.id})" style="background:red; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:3px; margin-left:5px;">Hapus</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (err) {
        console.error('Gagal memuat user:', err);
    }
}

// 3. Fungsi Simpan (Create & Update)
async function saveUser() {
    const id = document.getElementById('editUserId').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const token = localStorage.getItem('adminToken');

    if (!username || !email) {
        alert("Username dan Email wajib diisi!");
        return;
    }

    const isEdit = id !== "";
    const url = isEdit ? `/api/admin/users/${id}` : '/api/admin/users';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = { username, email };
    if (password) payload.password = password; 

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (res.ok) {
            alert(isEdit ? "User berhasil diperbarui" : "User berhasil ditambah");
            resetForm();
            loadUsers();
        } else {
            alert("Gagal menyimpan: " + result.message);
        }
    } catch (err) {
        console.error("Error saving user:", err);
        alert("Terjadi kesalahan sistem.");
    }
}

// 4. Fungsi Menyiapkan Data di Form untuk Edit
function prepareEdit(id, username, email) {
    document.getElementById('editUserId').value = id;
    document.getElementById('username').value = username;
    document.getElementById('userEmail').value = email;
    document.getElementById('userPassword').value = ""; // Password dikosongkan untuk keamanan
    
    document.getElementById('formTitle').innerText = "Edit User (ID: " + id + ")";
    document.getElementById('btnSave').innerText = "Update User";
    document.getElementById('btnCancel').style.display = "inline-block";
}

// 5. Fungsi Reset Form (Kembali ke mode Tambah)
function resetForm() {
    document.getElementById('editUserId').value = "";
    document.getElementById('username').value = "";
    document.getElementById('userEmail').value = "";
    document.getElementById('userPassword').value = "";
    
    document.getElementById('formTitle').innerText = "Tambah User Baru";
    document.getElementById('btnSave').innerText = "Simpan User";
    document.getElementById('btnCancel').style.display = "none";
}

// 6. Fungsi Hapus (Delete)
async function deleteUser(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;
    const token = localStorage.getItem('adminToken');
    
    try {
        const res = await fetch(`/api/admin/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (res.ok) {
            alert("User berhasil dihapus");
            loadUsers();
        } else {
            const errData = await res.json();
            alert("Gagal menghapus: " + errData.message);
        }
    } catch (err) {
        console.error('Error delete:', err);
    }
}