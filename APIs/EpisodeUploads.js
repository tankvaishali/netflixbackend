import express from 'express';
import multerupload from '../Middleware/multer.js';
import Uploadschema from '../MongoDB/Schema/Fileupload.js';

const EpisodeUpload = express.Router();

EpisodeUpload.post("/upload", multerupload.array("myFiles", 10), async (req, res) => {
    const files = req.files;

    const fileDocs = files.map(file => ({
        filename: file.filename,
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
    }));

    await Uploadschema.insertMany(fileDocs);

    res.json({
        message: "Files uploaded successfully",
        files: fileDocs.map(f => ({
            ...f,
            fileUrl: `http://localhost:8000/uploads/${f.filename}`,
        })),
    });
});

export default EpisodeUpload;
