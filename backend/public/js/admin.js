
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
            localStorage.setItem('token', data.token); 
            localStorage.setItem('adminEmail', email);

            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
            document.getElementById('adminEmailDisplay').innerText = email;

            loadUsers(); 
        } else {
            alert(data.message || 'Login Gagal! Pastikan akun adalah Admin.');
        }
    } catch (err) {
        console.error('Error Login:', err);
        alert('Gagal terhubung ke server');
    }
}

function handleLogin() {
    window.location.href = '/login.html';
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
        const userCountLabel = document.getElementById('userCount');
        
        if (!tableBody) return;
        if (userCountLabel) userCountLabel.innerText = users.length;

        tableBody.innerHTML = '';

        if (users.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" class="text-center py-10 text-gray-400">Belum ada data user.</td></tr>';
            return;
        }

        users.forEach(u => {
            const apiKeyVal = u.apiKey ? u.apiKey.api_key : '<span class="text-red-400 italic">No Key</span>';
            const tr = document.createElement('tr');
            tr.className = 'user-row shadow-sm';
            tr.innerHTML = `
                <td class="font-bold text-orange-600">#${u.id}</td>
                <td>
                    <div class="font-semibold text-[#433422]">${u.username}</div>
                    <div class="text-[10px] opacity-50 uppercase tracking-tighter">Client Member</div>
                </td>
                <td class="text-sm italic text-gray-600">${u.email}</td>
                
                <td class="text-[10px] font-mono text-orange-500 break-all max-w-[150px]">
                    ${apiKeyVal}
                </td>

                <td>
                    <div class="flex items-center justify-center gap-3">
                        <button onclick="prepareEdit(${u.id}, '${u.username}', '${u.email}')" 
                                class="btn-edit flex items-center gap-1 hover:scale-105 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                        </button>
                        <button onclick="deleteUser(${u.id})" 
                                class="btn-delete flex items-center gap-1 hover:scale-105 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Hapus
                        </button>
                    </div>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (err) {
        console.error('Gagal memuat user:', err);
    }
}

async function saveUser() {
    const idInput = document.getElementById('editUserId');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('userEmail');
    const passwordInput = document.getElementById('userPassword');
    const token = localStorage.getItem('adminToken');

    const id = idInput.value;
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    if (!username || !email) {
        alert("Username dan Email wajib diisi!");
        return;
    }

    const isEdit = id !== "";
    const url = isEdit ? `/api/admin/users/${id}` : '/api/admin/users';
    const method = isEdit ? 'PUT' : 'POST';

    const payload = { username, email };
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
            resetForm();
            loadUsers();
        } else {
            alert("Gagal menyimpan: " + (result.message || "Terjadi kesalahan"));
        }
    } catch (err) {
        console.error("Error saving user:", err);
        alert("Terjadi kesalahan sistem.");
    }
}

function prepareEdit(id, username, email) {
    document.getElementById('editUserId').value = id;
    document.getElementById('username').value = username;
    document.getElementById('userEmail').value = email;
    document.getElementById('userPassword').value = ""; 
    
    document.getElementById('formTitle').innerHTML = `<span class="w-2 h-6 bg-yellow-400 rounded-full"></span> Edit User (#${id})`;
    
    const btnSave = document.getElementById('btnSave');
    btnSave.innerText = "Update Data";
    btnSave.classList.replace('bg-orange-500', 'bg-yellow-500'); 
    
    document.getElementById('btnCancel').classList.remove('hidden');
}

function resetForm() {
    document.getElementById('editUserId').value = "";
    document.getElementById('username').value = "";
    document.getElementById('userEmail').value = "";
    document.getElementById('userPassword').value = "";
    
    document.getElementById('formTitle').innerHTML = `<span class="w-2 h-6 bg-orange-400 rounded-full"></span> Tambah User Baru`;
    
    const btnSave = document.getElementById('btnSave');
    btnSave.innerText = "Simpan User";
    btnSave.classList.add('bg-orange-500');
    btnSave.classList.remove('bg-yellow-500');
    
    document.getElementById('btnCancel').classList.add('hidden');
}

async function deleteUser(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;
    const token = localStorage.getItem('adminToken');
    
    try {
        const res = await fetch(`/api/admin/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (res.ok) {
            loadUsers();
        } else {
            const errData = await res.json();
            alert("Gagal menghapus: " + errData.message);
        }
    } catch (err) {
        console.error('Error delete:', err);
    }
}

function handleLogout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    localStorage.removeItem('adminEmail');
    window.location.reload();
}