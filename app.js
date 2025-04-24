import express from 'express';
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import MongoDb from './MongoDB/Connection.js';
import EpisodeUpload from './APIs/EpisodeUploads.js';
import register from './APIs/Registration.js';
import adminlogin from './APIs/AdminpanelLogin.js';
import AddSeason from './APIs/AddSeason.js';
import AddEpisode from './APIs/AddEpisode.js';
import AddSeries from './APIs/AddSeries.js';
import ChunkUpload from './Middleware/ChunkUpload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

MongoDb();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// http://localhost:8000/uploads
app.use("/", adminlogin)
app.use("/", EpisodeUpload);
app.use("/", register)
app.use("/", AddSeason)
app.use("/", AddEpisode)
app.use("/", AddSeries)

//add this 
app.use("/", ChunkUpload);
//and install fs-extra

app.listen(8000, () => console.log("Server running on port 8000"));
