import express from "express";
import fs from 'fs'
import Episode from "../MongoDB/Schema/Episode.js";
import multerupload from "../Middleware/multer.js";

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
            const { title, description, date, episodecount, season } = req.body;

            const thumbnail = req.files["thumbnail"]?.[0]?.path || "";
            const video = req.files["video"]?.[0]?.path || "";

            const episode = new Episode({
                title, description, date, episodecount, season, thumbnail, video,
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


// update
AddEpisode.put('/addepisode/:id', multerupload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, episodecount, season } = req.body;

        const episode = await Episode.findById(id);
        if (!episode) {
            return res.status(404).json({ error: "Episode not found" });
        }

        // Handle new thumbnail file
        if (req.files?.thumbnail?.[0]?.path) {
            if (episode.thumbnail) fs.unlink(episode.thumbnail, () => { });
            episode.thumbnail = req.files.thumbnail[0].path;
        }

        // Handle new video file
        if (req.files?.video?.[0]?.path) {
            if (episode.video) fs.unlink(episode.video, () => { });
            episode.video = req.files.video[0].path;
        }

        // Update fields if provided
        if (title) episode.title = title;
        if (description) episode.description = description;
        if (date) episode.date = date;
        if (episodecount) episode.episodecount = episodecount;
        if (series) episode.series = series;
        if (season) episode.season = season;

        await episode.save();
        res.json({ message: "Episode updated successfully", episode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update episode" });
    }
});

import { cloudinary } from '../Middleware/Cloudinary.js';

const extractPublicIdFromUrl = (url, folder) => {
  // Example: https://res.cloudinary.com/yourname/video/upload/v1715168445715/episode_videos/1715168445715-ep1.mp4
  const parts = url.split('/');
  const filenameWithExt = parts[parts.length - 1]; // e.g., 1715168445715-ep1.mp4
  const filename = filenameWithExt.split('.')[0]; // e.g., 1715168445715-ep1
  return `${folder}/${filename}`; // e.g., episode_videos/1715168445715-ep1
};

AddEpisode.delete('/addepisode/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Episode.findById(id);
    if (!existing) return res.status(404).json({ error: "Episode not found" });

    // Delete from Cloudinary
    if (existing.thumbnail) {
      const publicId = extractPublicIdFromUrl(existing.thumbnail, 'episode_thumbnails');
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    }

    if (existing.video) {
      const publicId = extractPublicIdFromUrl(existing.video, 'episode_videos');
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    }

    await Episode.findByIdAndDelete(id);

    res.json({ message: "Episode and Cloudinary media deleted successfully" });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    res.status(500).json({ error: "Failed to delete episode and media from Cloudinary" });
  }
});

export default AddEpisode;
