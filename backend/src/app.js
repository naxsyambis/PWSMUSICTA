require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const path = require('path'); 

const app = express();


app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.use(express.static('public')); 

app.use('/auth', require('./routes/auth.routes'));

app.use('/api/admin', require('./routes/admin.routes'));

app.use('/client', require('./routes/client.routes'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: err.message || 'Terjadi kesalahan pada server' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});