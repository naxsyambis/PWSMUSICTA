async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const apiKey = document.getElementById('login_api_key').value;

    // Validasi input sederhana di frontend
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

        if (res.ok) {
            // Simpan Token JWT (untuk Admin/Client)
            localStorage.setItem('token', result.token);
            
            // Simpan API Key jika login sebagai Client
            if (result.role === 'CLIENT') {
                localStorage.setItem('apiKey', result.apiKey);
            }

            alert("Login Berhasil!");
            // Redirect sesuai instruksi dari backend (Admin -> admin.html, Client -> index.html)
            window.location.href = result.redirect;
        } else {
            // Menampilkan pesan error spesifik dari backend (misal: "API Key tidak cocok")
            alert("Gagal Login: " + result.message);
        }
    } catch (err) {
        console.error("Login Error:", err);
        alert("Terjadi gangguan koneksi ke server.");
    }
}

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
            // Memunculkan area display di HTML
            const recoveryArea = document.getElementById('recovery-area');
            const keyDisplay = document.getElementById('new-key-display');
            
            if (recoveryArea && keyDisplay) {
                recoveryArea.style.display = 'block';
                keyDisplay.innerText = data.apiKey;
                alert("Verifikasi berhasil! API Key baru Anda telah muncul di bawah.");
            } else {
                // Fallback jika elemen HTML belum ada
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
        // Copy ke clipboard
        navigator.clipboard.writeText(key).then(() => {
            // Tempel ke input field otomatis
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