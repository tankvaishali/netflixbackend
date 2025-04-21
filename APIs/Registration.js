// import express from "express"
// import registerschema from "../MongoDB/Schema/Registrationschema.js";
// import multerupload from "../Middleware/multer.js";

// const register = express.Router()

// register.post("/registration", multerupload.single('profile'), async (req, res) => {
//     const { name, email, password, phnumber } = req.body;

//     // Basic validation
//     if (!name || !email || !password || !phnumber || !req.file) {
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     try {
//         // Check if user already exists
//         const existingUser = await registerschema.findOne({ email });
//         if (existingUser) {
//             return res.status(409).json({ message: "Email already registered" });
//         }

//         // Create and save new user
//         const newUser = new registerschema({
//             name, 
//             email, 
//             password, 
//             phnumber, 
//             profile: req.file.filename // Storing the uploaded file's name
//         });
//         await newUser.save();

//         res.status(201).json({ message: "User registered successfully", newUser });
//     } catch (error) {
//         console.error("Registration Error:", error);
//         res.status(500).json({ message: "Server error during registration" });
//     }
// });

// register.get("/users", async (req, res) => {
//     try {
//         const users = await registerschema.find({}, { password: 0 }); // Exclude password from results
//         res.status(200).json(users);
//     } catch (error) {
//         console.error("Fetching Users Error:", error);
//         res.status(500).json({ message: "Server error while fetching users" });
//     }
// });

// export default register


import express from "express";
import registerschema from "../MongoDB/Schema/Registrationschema.js";
import multerupload from "../Middleware/multer.js";
import fs from 'fs';
import path from 'path';

const register = express.Router();

register.post("/registration", multerupload.single('profile'), async (req, res) => {
    const { name, email, password, phnumber } = req.body;

    if (!name || !email || !password || !phnumber || !req.file) {
        // Clean up file if it exists
        if (req.file?.path) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await registerschema.findOne({ email });
        if (existingUser) {
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);
            return res.status(409).json({ message: "Email already registered" });
        }

        // Move file to real uploads folder
        const newPath = path.join('uploads', req.file.filename);
        fs.renameSync(req.file.path, newPath);

        const newUser = new registerschema({
            name,
            email,
            password,
            phnumber,
            profile: req.file.filename
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully", newUser });

    } catch (error) {
        console.error("Registration Error:", error);
        if (req.file?.path) fs.unlinkSync(req.file.path); // Clean up
        res.status(500).json({ message: "Server error during registration" });
    }
});
    
export default register