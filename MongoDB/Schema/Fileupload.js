import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    mimetype: String,
    size: Number,
});

const Uploadschema = mongoose.model("File", fileSchema);

export default Uploadschema;