// import express from 'express'

// const Moviemulter = express.Router()

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// Moviemulter.post('/upload-chunk', upload.single('chunk'), (req, res) => {
//     const { chunkIndex, totalChunks, filename } = req.body;
//     const filePath = path.join(uploadsDir, filename);

//     if (!fs.existsSync(filePath)) {
//         fs.writeFileSync(filePath, Buffer.alloc(0));
//     }

//     fs.appendFileSync(filePath, req.file.buffer);
//     console.log(`Uploaded chunk ${+chunkIndex + 1} of ${totalChunks}`);

//     if (+chunkIndex + 1 === +totalChunks) {
//         res.json({ message: 'File upload complete!' });
//     } else {
//         res.json({ message: `Chunk ${+chunkIndex + 1} uploaded` });
//     }
// });


// export default Moviemulter;
// import path from 'path';
// import { fileURLToPath } from 'url';
// import fs from 'fs'
// import multer from 'multer'

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const uploadsDir = path.join(__dirname, 'uploads/movie');
// if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// // Multer memory storage for chunk uploads
// const storage = multer.memoryStorage();
// const multerupload = multer({ storage });

// export default multerupload;