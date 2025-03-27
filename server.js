import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware pour l'API
app.use(express.json());
app.use('/api', (req, res, next) => {
    console.log('API call:', req.path);
    next();
});

// API Endpoint
app.get('/api/random-word', async (req, res) => {
    const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
    const [word] = await response.json();
    res.json({ word: word.toUpperCase() });
});

// Serveur les fichiers React en production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'src/client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'src/client/build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});