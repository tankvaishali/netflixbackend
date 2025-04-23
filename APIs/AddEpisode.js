import express from "express";
import Episode from "../MongoDB/Schema/Episode.js";
import multerupload from "../Middleware/multer.js";
import fs from 'fs'

// http://localhost:8000/addepisode
const AddEpisode = express.Router();

// post
AddEpisode.post(
    "/addepisode",
    multerupload.fields([
        { name: "thumbnail", maxCount: 1 },
        { name: "video", maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const {
                title,
                description,
                date,
                episodecount,
                series,
                season,
            } = req.body;

            const thumbnail = req.files["thumbnail"]?.[0]?.path || "";
            const video = req.files["video"]?.[0]?.path || "";

            const episode = new Episode({
                title,
                description,
                date,
                episodecount,
                series,
                season,
                thumbnail,
                video,
            });

            await episode.save();
            res.status(201).json({ message: "Episode created", data: episode });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

//get
AddEpisode.get('/addepisode', async (req, res) => {
    const data = await Episode.find()
    res.send({ data })
})


// delete
AddEpisode.delete('/addepisode/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await Episode.findById(id);
        if (!existing) return res.status(404).json({ error: "Episode not found" });

        // Remove files if they exist
        if (existing.thumbnail) fs.unlink(existing.thumbnail, () => { });
        if (existing.video) fs.unlink(existing.video, () => { });

        await Episode.findByIdAndDelete(id);

        res.json({ message: "Series and related data deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete episode and related data" });
    }
});


export default AddEpisode;
