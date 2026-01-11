require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.static('public'));

// 🔴 INI WAJIB ADA
app.use('/auth', require('./routes/auth.routes'));
app.use('/client', require('./routes/client.routes'));
app.use('/admin', require('./routes/admin.routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
