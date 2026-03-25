import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

router.get('/audios', (req, res) => {
    try {
        const audiosDir = path.join(process.cwd(), 'public', 'audios');

        // Create directory if it doesn't exist to prevent errors
        if (!fs.existsSync(audiosDir)) {
            fs.mkdirSync(audiosDir, { recursive: true });
        }

        const files = fs.readdirSync(audiosDir);
        const audioFiles = files.filter(file => file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.ogg'));

        res.json(audioFiles);
    } catch (error) {
        console.error('Error reading audios directory:', error);
        res.status(500).json({ error: 'Failed to read audios directory' });
    }
});

export default router;
