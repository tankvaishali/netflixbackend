// /MongoDB/Schema/Series.js
import mongoose from "mongoose";

const SeriesSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "", required: true },
    thumbnail: { type: String, required: true },
    video: { type: String, required: true },
    genres: { type: [String], default: [], required: true },
    releaseDate: { type: Date, required: true },
}, { timestamps: true });

const Series = mongoose.model("series", SeriesSchema);
export default Series;
