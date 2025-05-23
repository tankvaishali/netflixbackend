
import express from 'express';
import multerupload from '../Middleware/multer.js';
import Series from '../MongoDB/Schema/Series.js';
import Season from '../MongoDB/Schema/Season.js';
import Episode from '../MongoDB/Schema/Episode.js';
// import { cloudinary } from '../Middleware/Cloudinary.js';
import path from 'path';

const AddSeries = express.Router();

AddSeries.post('/addseries', multerupload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, genres, releaseDate, isFeatured, status } = req.body;

    const thumbnail = req.files?.thumbnail?.[0]?.path;
    const video = req.files?.video?.[0]?.path;

    const series = new Series({
      title,
      description,
      thumbnail,
      video,
      genres: genres?.split(',').map(g => g.trim()),
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

AddSeries.get('/addseries', async (req, res) => {
  try {
    const data = await Series.find();
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch series" });
  }
});

AddSeries.put('/addseries/:id', multerupload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, genres, releaseDate, isFeatured, status } = req.body;

    const series = await Series.findById(id);
    if (!series) return res.status(404).json({ error: "Series not found" });

    if (req.files?.thumbnail?.[0]?.path) {
      series.thumbnail = req.files.thumbnail[0].path;
    }

    if (req.files?.video?.[0]?.path) {
      series.video = req.files.video[0].path;
    } 
    if (title) series.title = title;
    if (description) series.description = description;
    if (genres) series.genres = genres.split(',').map(g => g.trim());
    if (releaseDate) series.releaseDate = releaseDate;
    if (typeof isFeatured !== 'undefined') series.isFeatured = isFeatured === 'true';
    if (status) series.status = status;

    await series.save();

    res.json({ message: "Series updated successfully", series });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update series" });
  }
});

AddSeries.delete('/addseries/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Series.findById(id);
    if (!existing) return res.status(404).json({ error: "Series not found" });

    // Delete associated seasons and episodes
    await Season.deleteMany({ series_id: id });
    await Episode.deleteMany({ series_id: id });

    // Delete series
    await Series.findByIdAndDelete(id);

    res.json({ message: "Series and related data deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete series" });
  }
});

export default AddSeries;