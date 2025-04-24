import express from 'express';
import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ChunkUpload = express.Router();
const upload = multer({ dest: path.join(__dirname, '../temp_chunks') });

// Upload individual chunk
ChunkUpload.post('/upload-chunk', upload.single('chunk'), async (req, res) => {
    const { filename, index } = req.body;
    const chunkDir = path.join(__dirname, '../temp_chunks', filename);
    await fs.ensureDir(chunkDir);

    const chunkPath = path.join(chunkDir, index);
    await fs.move(req.file.path, chunkPath);
    res.sendStatus(200);
});

// Merge all chunks into final file
ChunkUpload.post('/merge-chunks', async (req, res) => {
    const { filename } = req.body;
    const chunkDir = path.join(__dirname, '../temp_chunks', filename);
    const finalPath = path.join(__dirname, '../uploads', filename);

    const chunkFiles = await fs.readdir(chunkDir);
    chunkFiles.sort((a, b) => Number(a) - Number(b));

    const writeStream = fs.createWriteStream(finalPath);
    for (const file of chunkFiles) {
        const data = await fs.readFile(path.join(chunkDir, file));
        writeStream.write(data);
    }

    writeStream.end();
    writeStream.on('finish', async () => {
        await fs.remove(chunkDir);
        res.status(200).json({ message: "Video uploaded successfully", videoPath: `/uploads/${filename}` });
    });
});

export default ChunkUpload;


//create this

