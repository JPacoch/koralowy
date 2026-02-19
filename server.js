import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PALETTES_PATH = path.join(__dirname, 'palettes.json');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/palettes', (req, res) => {
    try {
        const data = fs.readFileSync(PALETTES_PATH, 'utf-8');
        res.json(JSON.parse(data));
    } catch (e) {
        res.status(500).json({ error: 'Could not read palettes.json' });
    }
});

app.post('/api/palettes', (req, res) => {
    try {
        const newPalette = req.body;
        const data = JSON.parse(fs.readFileSync(PALETTES_PATH, 'utf-8'));
        data.push(newPalette);
        fs.writeFileSync(PALETTES_PATH, JSON.stringify(data, null, 2));
        res.json({ success: true, palette: newPalette });
    } catch (e) {
        res.status(500).json({ error: 'Could not write palettes.json' });
    }
});

app.put('/api/palettes', (req, res) => {
    try {
        const palettes = req.body;
        fs.writeFileSync(PALETTES_PATH, JSON.stringify(palettes, null, 2));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Could not write palettes.json' });
    }
});

app.delete('/api/palettes/:index', (req, res) => {
    try {
        const idx = parseInt(req.params.index, 10);
        const data = JSON.parse(fs.readFileSync(PALETTES_PATH, 'utf-8'));
        if (idx < 0 || idx >= data.length) {
            return res.status(400).json({ error: 'Index out of range' });
        }
        data.splice(idx, 1);
        fs.writeFileSync(PALETTES_PATH, JSON.stringify(data, null, 2));
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Could not write palettes.json' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`🎨 Palette API server running at http://localhost:${PORT}`);
});
