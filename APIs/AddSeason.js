import express from 'express';
import multerupload from '../Middleware/multer.js';
import Season from '../MongoDB/Schema/Season.js';
import Episode from '../MongoDB/Schema/Episode.js';

const AddSeason = express.Router();

// post
AddSeason.post('/addseason', multerupload.none(), async (req, res) => {
    try {
        const { title, series_id } = req.body;
        const season = new Season({ title, series_id });
        await season.save();
        res.status(201).json({ message: "Season created successfully", season });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create Season" });
    }
});

// Get
AddSeason.get('/addseason', async (req, res) => {
    try {
        const data = await Season.find();
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch season" });
    }
});

// delete
AddSeason.delete('/addseason/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await Season.findById(id);
        if (!existing) return res.status(404).json({ error: "Season not found" });

        // Remove files if they exist
        if (existing.thumbnail) fs.unlink(existing.thumbnail, () => { });
        if (existing.video) fs.unlink(existing.video, () => { });

        // Delete related seasons and episodes
        await Episode.deleteMany({ season: id });

        // Now delete the series
        await Season.findByIdAndDelete(id);

        res.json({ message: "Season and related data deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete series and related data" });
    }
});

// update
export default AddSeason;
