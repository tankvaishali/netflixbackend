import express from 'express';
import cors from "cors";
import MongoDb from "./MongoDB/Connection.js";

const app = express()
app.use(express.json());
app.use(cors())
MongoDb()

app.listen(8000)