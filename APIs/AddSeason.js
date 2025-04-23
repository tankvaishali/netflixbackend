import express from 'express';
import multerupload from '../Middleware/multer.js';
import Season from '../MongoDB/Schema/Season.js';

const AddSeason = express.Router();

AddSeason.post('/addseason', multerupload.none(), async (req, res) => {
    try {
        const { title } = req.body;
        const season = new Season({ title });
        await season.save();
        res.status(201).json({ message: "Season created successfully", season });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create Season" });
    }
});

// Get All season
AddSeason.get('/addseason', async (req, res) => {
    try {
        const data = await Season.find();
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch season" });
    }
});

export default AddSeason;
