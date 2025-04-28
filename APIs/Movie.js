// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import Movie from '../MongoDB/Schema/Movie.js';

// const addMovie = express.Router();

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// const uploadsDir = path.join(process.cwd(), 'uploads/movie');
// if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// addMovie.post('/upload-chunk', upload.single('chunk'), async (req, res) => {
//     const { chunkIndex, totalChunks, filename, title, description, types, releaseDate, thumbnailUrl } = req.body;

//     const filePath = path.join(uploadsDir, filename);

//     // Create the file if it doesn't exist
//     if (!fs.existsSync(filePath)) {
//         fs.writeFileSync(filePath, Buffer.alloc(0));
//     }

//     // Append current chunk to file
//     fs.appendFileSync(filePath, req.file.buffer);
//     console.log(`Uploaded chunk ${+chunkIndex + 1} of ${totalChunks}`);

//     // If final chunk, save movie info in MongoDB
//     if (+chunkIndex + 1 === +totalChunks) {
//         const videoUrl = `/uploads/movie/${filename}`; // you can adjust this to a real public URL if needed

//         try {
//             const newMovie = new Movie({
//                 title,
//                 description,
//                 types: types ? JSON.parse(types) : [], // if types is sent as JSON string
//                 releaseDate,
//                 thumbnailUrl,
//                 videoUrl,
//             });

//             await newMovie.save();
//             return res.json({ message: 'Upload complete & movie saved', movie: newMovie });
//         } catch (err) {
//             console.error("Error saving movie:", err);
//             return res.status(500).json({ error: "Failed to save movie to DB" });
//         }
//     }

//     res.json({ message: `Chunk ${+chunkIndex + 1} uploaded` });
// });

// addMovie.get('/addmovie', async (req, res) => {
//     const data = await Movie.find()
//     res.send({ data })
// })

// export default addMovie;



import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Movie from '../MongoDB/Schema/Movie.js';

const addMovie = express.Router();

// Multer setup to handle a single chunk in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Ensure the movie upload folder exists
const uploadsDir = path.join(process.cwd(), 'uploads/movie');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// POST endpoint for chunked upload
addMovie.post('/upload-chunk', upload.single('chunk'), async (req, res) => {
    const { title, description, types, releaseDate, thumbnailUrl, chunkIndex, totalChunks, filename } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: 'No video chunk received' });
    }

    const filePath = path.join(uploadsDir, filename);

    // Create the file if it doesn't exist
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, Buffer.alloc(0));
    }

    // Append current chunk to file
    fs.appendFileSync(filePath, req.file.buffer);
    console.log(`Uploaded chunk ${+chunkIndex + 1} of ${totalChunks}`);

    // If final chunk, save movie info in MongoDB
    if (+chunkIndex + 1 === +totalChunks) {
        const videoUrl = `/uploads/movie/${filename}`; // Adjust if you serve statically

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
            return res.json({ message: 'Upload complete & movie saved', movie: newMovie });
        } catch (err) {
            console.error("Error saving movie:", err);
            return res.status(500).json({ error: "Failed to save movie to DB" });
        }
    }

    res.json({ message: `Chunk ${+chunkIndex + 1} uploaded` });
});

// For testing: Get all movies
addMovie.get('/addmovie', async (req, res) => {
    const data = await Movie.find();
    res.send({ data });
});

export default addMovie;
