import express from 'express';
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import MongoDb from './MongoDB/Connection.js';
import EpisodeUpload from './APIs/EpisodeUploads.js';
import register from './APIs/Registration.js';
import adminlogin from './APIs/AdminpanelLogin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(cors());

MongoDb();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// http://localhost:8000/uploads
app.use("/",adminlogin)
app.use("/", EpisodeUpload);
app.use("/",register)

app.listen(8000, () => console.log("Server running on port 8000"));
