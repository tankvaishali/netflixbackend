import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    title: { type: String },
    description: String,
    types: [String],
    releaseDate: Date,
    thumbnailUrl: String,
    videoUrl: String,
}, { timestamps: true });

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;