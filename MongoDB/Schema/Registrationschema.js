
import mongoose from "mongoose";

const regSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phnumber: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        required: true

    },

}, { timestamps: true });

const registerschema = mongoose.model('regiter', regSchema);
export default registerschema;