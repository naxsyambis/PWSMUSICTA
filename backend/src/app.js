require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Tambahkan ini jika ada masalah akses dari browser

const app = express();

// 1. MIDDLEWARE (Wajib di atas Routes)
app.use(express.json()); // Membaca data JSON (untuk login & CRUD)
app.use(express.urlencoded({ extended: true })); 
app.use(express.static('public')); // Melayani file HTML, CSS, JS di folder public

// 2. ROUTES
// Auth (Login & Register)
app.use('/auth', require('./routes/auth.routes'));

// Admin CRUD (Data Client) - Gunakan satu prefix saja yang konsisten
app.use('/api/admin', require('./routes/admin.routes'));

// Client (Music, dll)
app.use('/client', require('./routes/client.routes'));

// 3. ERROR HANDLING (Opsional tapi berguna)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: err.message || 'Terjadi kesalahan pada server' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});