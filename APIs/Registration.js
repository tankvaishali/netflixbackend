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
import { log } from "console";

const register = express.Router();

register.post("/registration", multerupload.single('profile'), async (req, res) => {
    const { name, email, password, phnumber,subscription } = req.body;

    if (!name || !email || !password || !phnumber || !req.file || !subscription) {
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
            subscription,
            profile: req.file.filename
        });
        
          await newUser.save();

        res.status(201).json({ message: "User registered successfully", newUser });
        console.log(newUser);

    } catch (error) {
        console.error("Registration Error:", error);
        if (req.file?.path) fs.unlinkSync(req.file.path); // Clean up
        res.status(500).json({ message: "Server error during registration" });
    }
});
    
register.get("/users", async (req, res) => {
    try {
        const users = await registerschema.find(); // Exclude password from results
        res.status(200).json(users);
        console.log(users);
        
    } catch (error) {
        console.error("Fetching Users Error:", error);
        res.status(500).json({ message: "Server error while fetching users" });
    }
});

register.delete("/users/:id", async (req, res) => {
    try {
        const user = await registerschema.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Delete the profile image from 'uploads' folder
        const filePath = path.join('uploads', user.profile);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete the user from the database
        await registerschema.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete User Error:", error);
        res.status(500).json({ message: "Server error while deleting user" });
    }
});

export default register