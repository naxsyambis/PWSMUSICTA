async function registerClient() {
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const outputContainer = document.getElementById('output-container');
  const output = document.getElementById('output');

  outputContainer.classList.add('hidden');

  try {
    const res = await fetch('/client/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (res.status === 201) {
      outputContainer.className = "mt-6 p-6 bg-orange-50 text-[#433422] rounded-2xl block border border-orange-200 shadow-inner";
      
      output.innerHTML = `
        <div class="text-center">
          <p class="font-bold text-lg mb-2 text-orange-700">Registrasi Berhasil!</p>
          <p class="text-xs mb-4 opacity-70">Simpan API Key Anda di bawah ini untuk mengakses aplikasi:</p>
          
          <div class="bg-white p-3 rounded-xl border border-orange-100 flex items-center justify-between gap-2 mb-4">
            <code id="key" class="text-[10px] break-all font-mono text-orange-600">${data.data.apiKey}</code>
            <button onclick="copyKey()" class="bg-[#433422] text-white px-3 py-1 rounded-lg text-[10px] font-bold shrink-0 hover:bg-black transition">Salin</button>
          </div>
          
          <p class="text-xs">Sudah simpan? <a href="/login.html" class="font-bold underline text-orange-800">Silakan Login</a></p>
        </div>
      `;
    } else {
      outputContainer.className = "mt-6 p-4 bg-red-50 text-red-700 rounded-xl block border border-red-100";
      output.innerText = data.message || "Gagal melakukan registrasi.";
    }
  } catch (err) {
    console.error("Register Error:", err);
    outputContainer.className = "mt-6 p-4 bg-red-50 text-red-700 rounded-xl block border border-red-100";
    output.innerText = "Terjadi kesalahan sistem saat menghubungi server.";
  }
}

function copyKey() {
  const keyText = document.getElementById('key').innerText;
  const copyBtn = event.target; 

  navigator.clipboard.writeText(keyText).then(() => {
    const originalText = copyBtn.innerText;
    copyBtn.innerText = "Tersalin!";
    copyBtn.classList.replace('bg-[#433422]', 'bg-green-600');
    
    setTimeout(() => {
      copyBtn.innerText = originalText;
      copyBtn.classList.replace('bg-green-600', 'bg-[#433422]');
    }, 2000);
  });
}