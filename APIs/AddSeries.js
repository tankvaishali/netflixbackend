import express from 'express';
import multerupload from '../Middleware/multer.js';
import Series from '../MongoDB/Schema/Series.js';

const AddSeries = express.Router();

// Create Series
AddSeries.post('/addseries', multerupload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            title,
            description,
            genres,
            releaseDate,
            isFeatured,
            status
        } = req.body;

        const thumbnail = req.files?.thumbnail?.[0]?.path;
        const video = req.files?.video?.[0]?.path;

        const series = new Series({
            title,
            description,
            thumbnail,
            video,
            genres: genres?.split(',').map(g => g.trim()), // in case genres come as a comma string
            releaseDate,
            isFeatured: isFeatured === 'true',
            status
        });

        await series.save();
        res.status(201).json({ message: "Series created successfully", series });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create series" });
    }
});

// Get All Series
AddSeries.get('/addseries', async (req, res) => {
    try {
        const data = await Series.find();
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch series" });
    }
});

export default AddSeries;
