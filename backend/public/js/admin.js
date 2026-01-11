// public/js/admin.js

/**
 * 1. Fungsi Login Admin
 * Digunakan saat admin pertama kali login melalui form di admin.html
 */
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
            // Simpan token ke localStorage
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('token', data.token); 

            // Update Tampilan: Sembunyikan login, munculkan dashboard
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';

            // Muat data tabel
            loadUsers(); 
            alert('Login Berhasil!');
        } else {
            alert(data.message || 'Login Gagal! Pastikan akun adalah Admin.');
        }
    } catch (err) {
        console.error('Error Login:', err);
        alert('Gagal terhubung ke server');
    }
}

/**
 * 2. Fungsi Load Data (Read)
 * Mengambil data semua client dari backend
 */
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
                    <button onclick="prepareEdit(${u.id}, '${u.username}', '${u.email}')" style="background:#ffc107; border:none; padding:5px 10px; cursor:pointer; border-radius:3px; font-weight:bold;">Edit</button>
                    <button onclick="deleteUser(${u.id})" style="background:#dc3545; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:3px; margin-left:5px; font-weight:bold;">Hapus</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (err) {
        console.error('Gagal memuat user:', err);
    }
}

/**
 * 3. Fungsi Simpan (Create & Update)
 * Mengirim data ke backend berdasarkan mode (Tambah/Edit)
 */
async function saveUser() {
    // Ambil elemen input
    const idInput = document.getElementById('editUserId');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('userEmail');
    const passwordInput = document.getElementById('userPassword');
    const token = localStorage.getItem('adminToken');

    const id = idInput.value;
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    // Validasi sederhana
    if (!username || !email) {
        alert("Username dan Email wajib diisi!");
        return;
    }

    // Tentukan mode: Jika ID kosong = POST (Tambah), Jika ID ada = PUT (Edit)
    const isEdit = id !== "";
    const url = isEdit ? `/api/admin/users/${id}` : '/api/admin/users';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = { username, email };
    
    // Kirim password hanya jika diisi (untuk fitur tambah atau ganti password)
    if (password && password.trim() !== "") {
        payload.password = password;
    }

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
            alert(isEdit ? "User berhasil diperbarui!" : "User baru berhasil ditambahkan!");
            resetForm(); // Kosongkan form kembali
            loadUsers(); // Refresh tabel
        } else {
            alert("Gagal menyimpan: " + (result.message || "Terjadi kesalahan"));
        }
    } catch (err) {
        console.error("Error saving user:", err);
        alert("Terjadi kesalahan sistem saat mencoba menghubungi server.");
    }
}

/**
 * 4. Fungsi Menyiapkan Data di Form untuk Edit (Mode Update)
 */
function prepareEdit(id, username, email) {
    document.getElementById('editUserId').value = id;
    document.getElementById('username').value = username;
    document.getElementById('userEmail').value = email;
    document.getElementById('userPassword').value = ""; // Kosongkan field password
    
    // Update Tampilan Form
    document.getElementById('formTitle').innerText = "Edit User (ID: " + id + ")";
    document.getElementById('btnSave').innerText = "Update User";
    document.getElementById('btnSave').style.background = "#ffc107";
    document.getElementById('btnSave').style.color = "black";
    document.getElementById('btnCancel').style.display = "inline-block";
}

/**
 * 5. Fungsi Reset Form (Kembali ke mode Tambah)
 */
function resetForm() {
    document.getElementById('editUserId').value = "";
    document.getElementById('username').value = "";
    document.getElementById('userEmail').value = "";
    document.getElementById('userPassword').value = "";
    
    // Kembalikan Tampilan Form ke Default
    document.getElementById('formTitle').innerText = "Tambah User Baru";
    document.getElementById('btnSave').innerText = "Simpan User";
    document.getElementById('btnSave').style.background = "#28a745";
    document.getElementById('btnSave').style.color = "white";
    document.getElementById('btnCancel').style.display = "none";
}

/**
 * 6. Fungsi Hapus (Delete)
 */
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
        alert("Terjadi kesalahan saat menghapus data.");
    }
}