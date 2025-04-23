import express from "express";
import Episode from "../MongoDB/Schema/Episode.js";
import multerupload from "../Middleware/multer.js";

const AddEpisode = express.Router();

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
                series_id,
                season_id,
            } = req.body;

            const thumbnail = req.files["thumbnail"]?.[0]?.path || "";
            const video = req.files["video"]?.[0]?.path || "";

            const episode = new Episode({
                title,
                description,
                date,
                episodecount,
                series_id,
                season_id,
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

// http://localhost:8000/addepisode
AddEpisode.get('/addepisode', async (req, res) => {
    const data = await Episode.find()
    res.send({ data })
})

export default AddEpisode;
