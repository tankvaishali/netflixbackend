import mongoose from "mongoose";

const SeasonSchema = new mongoose.Schema({
    title: { type: String, required: true },
    series_id: { type: String }
}, { timestamps: true });

const Season = mongoose.model('season', SeasonSchema);

export default Season;