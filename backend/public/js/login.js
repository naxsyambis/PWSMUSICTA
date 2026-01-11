async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const apiKey = document.getElementById('login_api_key').value;

    // 1. Validasi input sederhana
    if (!email || !password) {
        alert("Email dan Password wajib diisi.");
        return;
    }

    try {
        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, apiKey })
        });

        const result = await res.json();
        console.log("Respon Server:", result);

        if (res.ok) {
            // 2. Bersihkan storage lama agar data tidak tertukar
            localStorage.clear();

            // 3. Simpan Token JWT utama
            localStorage.setItem('token', result.token);
            
            // 4. Logika Spesifik Berdasarkan Role
            if (result.role === 'ADMIN') {
                // PENTING: Simpan juga sebagai 'adminToken' agar admin.html 
                // bisa langsung menampilkan dashboard tanpa login ulang
                localStorage.setItem('adminToken', result.token);
                alert("Selamat datang Admin!");
            } else if (result.role === 'CLIENT') {
                // Simpan API Key hanya untuk Client
                localStorage.setItem('apiKey', result.apiKey);
                alert("Login Client Berhasil!");
            }

            // 5. Redirect otomatis berdasarkan data dari backend atau fallback
            if (result.redirect) {
                window.location.href = result.redirect;
            } else {
                window.location.href = (result.role === 'ADMIN') ? '/admin.html' : '/index.html';
            }
            
        } else {
            alert("Gagal Login: " + result.message);
        }
    } catch (err) {
        console.error("Login Error:", err);
        alert("Terjadi gangguan koneksi ke server.");
    }
}

// Fungsi forgotApiKey dan copyAndFill tetap sama seperti sebelumnya
async function forgotApiKey() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert("Silakan isi Email dan Password Anda di atas untuk memverifikasi identitas Anda.");
        return;
    }

    if (!confirm("Apakah Anda yakin ingin membuat API Key baru? Key lama tidak akan bisa digunakan lagi.")) {
        return;
    }

    try {
        const res = await fetch('/client/api-key/recovery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            const recoveryArea = document.getElementById('recovery-area');
            const keyDisplay = document.getElementById('new-key-display');
            
            if (recoveryArea && keyDisplay) {
                recoveryArea.style.display = 'block';
                keyDisplay.innerText = data.apiKey;
                alert("Verifikasi berhasil! API Key baru Anda telah muncul di bawah.");
            } else {
                alert("API Key Baru Anda: " + data.apiKey);
            }
        } else {
            alert("Gagal memulihkan API Key: " + data.message);
        }
    } catch (err) {
        console.error("Recovery Error:", err);
        alert("Terjadi kesalahan pada server saat mencoba memulihkan key.");
    }
}

function copyAndFill() {
    const key = document.getElementById('new-key-display').innerText;
    const inputField = document.getElementById('login_api_key');

    if (key) {
        navigator.clipboard.writeText(key).then(() => {
            if (inputField) {
                inputField.value = key;
            }
            alert("API Key disalin dan otomatis terisi di form login.");
        }).catch(err => {
            console.error('Gagal menyalin:', err);
            if (inputField) inputField.value = key;
        });
    }
}