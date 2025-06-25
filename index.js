const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('PLEASE INPUT YO MONGODB HERE', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Book Schema
const bookSchema = new mongoose.Schema({
    id: Number,
    title: String,
    author: String,
    description: String,
    isPublic: Boolean
});

const Book = mongoose.model('Book', bookSchema);

// Middleware untuk "autentikasi" sederhana
const authMiddleware = (req, res, next) => {
    // Dalam real-world scenario, ini akan memeriksa token/session
    const userToken = req.headers['authorization'];
    if (!userToken) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// Endpoint untuk mendapatkan semua buku publik
app.get('/api/books', async (req, res) => {
    try {
        const publicBooks = await Book.find({ isPublic: true });
        res.json(publicBooks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint yang rentan BOLA
app.get('/api/books/:id', authMiddleware, async (req, res) => {
    try {
        const book = await Book.findOne({ id: req.params.id });
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Seed database dengan beberapa buku
async function seedDatabase() {
    await Book.deleteMany({});
    
    const books = [
        { id: 1, title: 'Pemrograman JavaScript', author: 'John Doe', description: 'Buku dasar pemrograman JavaScript', isPublic: true },
        { id: 2, title: 'Keamanan Aplikasi Web', author: 'Jane Smith', description: 'Pengenalan keamanan aplikasi web modern', isPublic: true },
        { id: 3, title: 'MongoDB untuk Pemula', author: 'Alex Johnson', description: 'Panduan lengkap MongoDB untuk pemula', isPublic: true },
        { id: 4, title: 'RAHASIA_PERPUSTAKAAN', author: 'Admin', description: 'CTF_FLAG{BOLA_1s_Fun_In_ExpressMongo}', isPublic: false },
        { id: 5, title: 'Catatan Harian Librarian', author: 'Librarian', description: 'Catatan pribadi librarian', isPublic: false }
    ];
    
    await Book.insertMany(books);
    console.log('Database seeded!');
}

// Start server
const PORT = 3000;
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    await seedDatabase();
});
