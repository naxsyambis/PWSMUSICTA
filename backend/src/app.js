// backend/src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const path = require('path'); // Tambahkan ini untuk mengelola path file

const app = express();

// 1. MIDDLEWARE (Wajib di atas Routes)
app.use(cors()); // Mengaktifkan CORS
app.use(express.json()); // Membaca data JSON
app.use(express.urlencoded({ extended: true })); 

// --- PERBAIKAN RUTE UTAMA ---
// Paksa rute utama (localhost:3000) untuk menampilkan login.html
// Ini harus diletakkan DI ATAS express.static agar index.html tidak otomatis terbuka
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Melayani file statis (CSS, JS, Gambar) dari folder public
app.use(express.static('public')); 

// 2. ROUTES
// Auth (Login & Register)
app.use('/auth', require('./routes/auth.routes'));

// Admin CRUD (Data Client)
app.use('/api/admin', require('./routes/admin.routes'));

// Client (Music, dll)
app.use('/client', require('./routes/client.routes'));

// 3. ERROR HANDLING
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: err.message || 'Terjadi kesalahan pada server' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});