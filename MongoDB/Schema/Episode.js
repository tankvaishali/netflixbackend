import mongoose from "mongoose";

const EpisodeSchema = new mongoose.Schema({

    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    video: { type: String, required: true },
    date: { type: Date, required: true },
    // series: { type: String, required: true },
    season: { type: String, required: true },
    episodecount: { type: Number, required: true },

}, { timestamps: true });

const Episode = mongoose.model('episode', EpisodeSchema);

export default Episode;