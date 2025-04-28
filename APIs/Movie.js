import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Movie from '../MongoDB/Schema/Movie.js';

const addMovie = express.Router();

const thumbnailCache = {};

const upload = multer({ storage: multer.memoryStorage() }).fields([
    { name: 'chunk', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]);

const uploadsDir = path.join(process.cwd(), 'uploads');
const movieDir = path.join(uploadsDir, 'movie');
const imageDir = path.join(uploadsDir, 'images');

if (!fs.existsSync(movieDir)) {
    fs.mkdirSync(movieDir, { recursive: true });
}

if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

addMovie.post('/upload-chunk', upload, async (req, res) => {
    const { title, description, types, releaseDate, chunkIndex, totalChunks, filename } = req.body;
    const files = req.files;

    if (!files || !files['chunk']) {
        return res.status(400).json({ error: 'No video chunk received' });
    }

    const videoChunk = files['chunk'][0];
    const thumbnailFile = files['thumbnail'] ? files['thumbnail'][0] : null;

    const filePath = path.join(movieDir, filename);

    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, Buffer.alloc(0));
    }
    fs.appendFileSync(filePath, videoChunk.buffer);
    console.log(`Uploaded chunk ${+chunkIndex + 1} of ${totalChunks}`);

    let thumbnailUrl = null;

    if (chunkIndex == 0 && thumbnailFile) {

        if (!fs.existsSync(imageDir)) {
            fs.mkdirSync(imageDir, { recursive: true });
        }

        const thumbnailFilename = Date.now() + '-' + thumbnailFile.originalname;
        const thumbnailFullPath = path.join(imageDir, thumbnailFilename);
        fs.writeFileSync(thumbnailFullPath, thumbnailFile.buffer);

        thumbnailUrl = `/uploads/images/${thumbnailFilename}`;

        thumbnailCache[filename] = thumbnailUrl;
    }

    if (+chunkIndex + 1 === +totalChunks) {
        const videoUrl = `/uploads/movie/${filename}`;
        thumbnailUrl = thumbnailCache[filename] || null;

        try {
            const newMovie = new Movie({
                title,
                description,
                types: types ? JSON.parse(types) : [],
                releaseDate,
                thumbnailUrl,
                videoUrl,
            });
            await newMovie.save();
            delete thumbnailCache[filename];
            return res.json({ message: 'Upload complete & movie saved', movie: newMovie });
        } catch (err) {
            console.error("Error saving movie:", err);
            return res.status(500).json({ error: "Failed to save movie to DB" });
        }
    }

    res.json({ message: `Chunk ${+chunkIndex + 1} uploaded` });
});

addMovie.get('/addmovie', async (req, res) => {
    const data = await Movie.find();
    res.send({ data });
});

export default addMovie;
